import Contact from "../Model/ContactModel.js";

// =====================================================
// ADD CONTACT MESSAGE
// =====================================================

export const addContact = async (req, res) => {
  try {
    console.log("================================");
    console.log("ADD CONTACT API");
    console.log("BODY:", req.body);
    console.log("================================");

    const {
      name,
      email,
      phone,
      subject,
      message,
    } = req.body;

    // =================================================
    // VALIDATION
    // =================================================

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject and message are required",
      });
    }

    // =================================================
    // EMAIL VALIDATION
    // =================================================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // =================================================
    // CREATE CONTACT
    // =================================================

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : "",
      subject: subject.trim(),
      message: message.trim(),
      status: "Pending",
    });

    console.log("CONTACT SAVED:");
    console.log(contact);

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({
      success: true,
      message: "Your message has been submitted successfully",
      data: contact,
    });

  } catch (error) {
    console.error("ADD CONTACT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit contact message",
      error: error.message,
    });
  }
};


// =====================================================
// GET ALL CONTACT MESSAGES
// =====================================================

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Contact messages fetched successfully",
      count: contacts.length,
      data: contacts,
    });

  } catch (error) {
    console.error("GET CONTACT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact messages",
      error: error.message,
    });
  }
};


// =====================================================
// GET SINGLE CONTACT
// =====================================================

export const getSingleContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact message fetched successfully",
      data: contact,
    });

  } catch (error) {
    console.error("GET SINGLE CONTACT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact message",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE CONTACT STATUS
// =====================================================

export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // =================================================
    // VALID STATUS
    // =================================================

    if (!["Pending", "Read", "Replied"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // =================================================
    // FIND CONTACT
    // =================================================

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    // =================================================
    // UPDATE
    // =================================================

    contact.status = status;

    await contact.save();

    return res.status(200).json({
      success: true,
      message: "Contact status updated successfully",
      data: contact,
    });

  } catch (error) {
    console.error("UPDATE CONTACT STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update contact status",
      error: error.message,
    });
  }
};


// =====================================================
// DELETE CONTACT
// =====================================================

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    await Contact.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Contact message deleted successfully",
    });

  } catch (error) {
    console.error("DELETE CONTACT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete contact message",
      error: error.message,
    });
  }
};