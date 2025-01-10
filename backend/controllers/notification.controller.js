import Notification from "../models/Notification.model.js";

export const getNotification = async (req, res) => {
  try {
    const notify = await Notification.find({ recepient: req.user._id })
      .sort({ createdAt: -1 })
      .populate("relatedUser", "name username profilePicture")
      .populate("relatedPost", "content image");

    res.status(200).json({
      success: true,
      message: "feltch notification",
      notifications: notify,
    });
  } catch (error) {
    console.log("error happend while getting the notification " + error);
    res.status(500).json({
      message: "server error",
      success: false,
    });
  }
};

export const markNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      {
        _id: id,
        recepient: req.user._id,
      },
      { read: true },
      { new: true }
    );
  } catch (error) {
    console.log("error happend while marking read the notification " + error);
    res.status(500).json({
      message: "server error",
      success: false,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
  } catch (error) {
    console.log("error happend while getting the notification " + error);
    res.status(500).json({
      message: "server error",
      success: false,
    });
  }
};
