import Consultation from "../Model/ConsultationModel.js";
import User from "../Model/UserSchema.js";

// ========================================
// BOOK CONSULTATION
// ========================================

export const bookConsultation = async (req, res) => {
  try {
    console.log("CONSULTATION BODY:", req.body);

    const {
      name,
      email,
      phone,
      consultationType,
      preferredDate,
      preferredTime,
      budget,
      message,
    } = req.body;

    // Required fields
    if (
      !name ||
      !email ||
      !phone ||
      !consultationType ||
      !preferredDate ||
      !preferredTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Phone validation
    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit phone number.",
      });
    }

    // Create consultation
    const consultation = new Consultation({
      name,
      email,
      phone,
      consultationType,
      preferredDate,
      preferredTime,
      budget,
      message,
    });

    const savedConsultation =
      await consultation.save();

    console.log(
      "CONSULTATION SAVED:",
      savedConsultation
    );

    return res.status(201).json({
      success: true,
      message:
        "Your consultation request has been submitted successfully!",
      data: savedConsultation,
    });

  } catch (error) {
    console.error(
      "BOOK CONSULTATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to book consultation.",
      error: error.message,
    });
  }
};


// ========================================
// GET ALL CONSULTATIONS
// ========================================

export const getConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find()
      .sort({ createdAt: -1 })
      .lean();

    // Fetch avatar for every booking
    const bookingsWithAvatar = await Promise.all(
      consultations.map(async (booking) => {
        const user = await User.findOne({
          email: booking.email,
        })
          .select("avatar")
          .lean();

        return {
          ...booking,

          // User avatar
          avatar:
            user?.avatar ||
            "/avatars/default.jpg",
        };
      })
    );

    console.log(
      "BOOKINGS WITH AVATAR:",
      bookingsWithAvatar
    );

    return res.status(200).json({
      success: true,
      count: bookingsWithAvatar.length,
      data: bookingsWithAvatar,
    });
  } catch (error) {
    console.error(
      "GET CONSULTATIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch consultations.",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE CONSULTATION STATUS
// ==========================================

export const updateConsultationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Completed",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid consultation status.",
      });
    }

    const consultation =
      await Consultation.findByIdAndUpdate(
        id,
        { status },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    console.log(
      "STATUS UPDATED:",
      consultation
    );

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully.",
      data: consultation,
    });
  } catch (error) {
    console.error(
      "UPDATE STATUS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update booking status.",
      error: error.message,
    });
  }
};




// ==========================================
// DELETE BOOKING
// ==========================================
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Check booking exists
    const booking = await Consultation.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Delete booking
    await Consultation.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });

  } catch (error) {
    console.error("Delete Booking Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete booking",
      error: error.message,
    });
  }
};

