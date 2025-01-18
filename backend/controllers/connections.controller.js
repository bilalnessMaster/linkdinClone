import ConnectionRequest from "../models/connectionRequest.model.js";
import User from "../models/User.model.js";
import Notification from "../models/Notification.model.js";

export const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const senderId = req.user._id;
    if (userId.toString() === senderId.toString()) {
      return res.status(200).json({
        success: false,
        message: "send request to you self",
      });
    }
    if (req.user.connections.includes(userId)) {
      return res.status(200).json({
        success: false,
        message: "Your are already connected",
      });
    }
    const connection = await ConnectionRequest.findOne({
      recipient: userId,
      sender: senderId,
      status: "pending",
    });
    if (connection) {
      return res.status(200).json({
        success: false,
        message: "connection request already exists",
      });
    }
    const NewConnection = new ConnectionRequest({
      sender: senderId,
      recipient: userId,
    });
    await NewConnection.save();

    res.status(200).json({
      success: true,
      message: "create a connection request",
    });
  } catch (error) {
    console.log("error happend while sending connection" + error);
    res.status(500).json({
      message: "server error",
      success: false,
    });
  }
};

export const acceptConnecttionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;
    const connection = await ConnectionRequest.findById(requestId)
      .populate("sender", "name username email")
      .populate("recipient", "name username email ");
    if (!connection) {
      return res.status(404).json({
        message: "request does not found",
        success: false,
      });
    }
    if (userId.toString() !== connection.recipient._id.toString()) {
      return res.status(403).json({
        message: "your are unauthorize to accepte request that arn't yours ",
        success: false,
      });
    }
    if (connection.status !== "pending") {
      return res.status(400).json({
        message: "this request has already  been  proccessed",
        success: false,
      });
    }
    connection.status = "accepted";
    await connection.save();
    const userOne = await User.findByIdAndUpdate(userId, {
      $addToSet: {
        connections: connection.sender._id,
      },
    });
    const userTwo = await User.findByIdAndUpdate(connection.sender._id, {
      $addToSet: {
        connections: userId,
      },
    });
    const notification = new Notification({
      recipient: connection.sender._id,
      type: "connnectionAccepted",
      relatedUser: userId,
    });

    await notification.save();
    try {
      const senderEmail = connection.sender.email;
      const senderName = connection.sender.name;
      const recipientName = connection.recipient.name;
      const profileUrl =
        process.env.CLIENT_URL + "/profile/" + connection.recipient.username;
      await sendConnectionAcceptedEmail(
        senderEmail,
        senderName,
        recipientName,
        profileUrl
      );
    } catch (error) {
      console.log("error happend while send email accepte connection" + error);
    }
    res.status(200).json({
      success: true,
      message: "connection accepted request",
    });
  } catch (error) {
    console.log("error happend while accepte connection" + error);
    res.status(500).json({
      message: "server error",
      success: false,
    });
  }
};

export const rejectConnecttionRequest = async (req, res) => {
  try {
    const { requesId } = req.params;
    const userId = req.user._id;
    const request = await ConnectionRequest.findById(requesId);
    if (request.recipient.toString() !== userId.toString()) {
      return res.status(400).json({
        message: "you are unauthorize to proccess this request",
        success: false,
      });
    }
    if (request.status !== "pending") {
      return res.status(400).json({
        message: "this request has already  been  proccessed",
        success: false,
      });
    }
    request.status = "rejected";
    await request.save();
    res.status(200).json({
      success: true,
      message: "connection rejected request",
    });
  } catch (error) {
    console.log("error happend while reject connection" + error);
    res.status(500).json({
      message: "server error",
      success: false,
    });
  }
};
export const getConnectionRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await ConnectionRequest.find({
      recipient: userId,
      status: "pending",
    }).populate("sender", "username name profilePicture headline connections");
    res.status(200).json({
      success: true,
      message: "all the requests",
      requests,
    });
  } catch (error) {
    console.log("error happend while getting requests " + error);
    res.status(500).json({
      message: "server error",
      success: false,
    });
  }
};
export const getUserConnections = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate(
      "connections",
      "username name  profilePicture headline connections"
    );

    res.status(200).json({
      success: true,
      message: "connection rejected request",
      connections: user.connections,
    });
  } catch (error) {
    console.log("error happend while GETTING connection" + error);
    res.status(500).json({
      message: "server error",
      success: false,
    });
  }
};
export const removeUserFromConnection = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentuserId = req.user._id;
    await User.findByIdAndUpdate(userId, {
      $pull: {
        connections: currentuserId,
      },
    });
    await User.findByIdAndUpdate(currentuserId, {
      $pull: {
        connections: userId,
      },
    });
    res.status(200).json({
      success: true,
      message: "connection removed successfully",
    });
  } catch (error) {
    console.log("error happend while removing connection" + error);
    res.status(500).json({
      message: "server error",
      success: false,
    });
  }
};

export const getstatus = async (req, res) => {
  try {
      const targetUserId = req.params.userId
      const currentuserId =  req.user._id
      const currentUser = req.user
      if(currentUser.connections.includes(targetUserId)){
        return res.status(200).json({
          success :  true  , 
          message : "connected"
        })
      }
      const pendingRequest = await ConnectionRequest.findOne({
        $or  : [
          {sender : currentuserId , recipient : targetUserId },
          {sender : targetUserId , recipient : currentuserId}
        ],
        status : "pending"
      })

      if(pendingRequest){
        if(pendingRequest.sender.toString() === currentuserId.toString()){
          return res.status(200).json({
            success :  true  , 
            message : "pending" , 
            requesId : pendingRequest._id
          })
        }else{
          return res.status(200).json({
            success :  true  , 
            message : "received"
          })
        }
      }
      return res.status(200).json({
        success :  true  , 
        message : "not connected"
      })
  } catch (error) {
    console.log("error happend while checking status" + error);
    res.status(500).json({
      message: "server error",
      success: false,
    });
  }
};
