import Event from "../Model/EventModel.js";
import Category from "../Model/CategoryModel.js";

// =====================================================
// ADD EVENT
// =====================================================

export const addEvent = async (req, res) => {
  try {
    console.log("========== ADD EVENT ==========");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
      title,
      start_date,
      end_date,
      start_time,
      end_time,
      price,
      cate_id,
      cate_nm,
      location,
      description,
    } = req.body;

    // =============================
    // VALIDATION
    // =============================

    if (
      !title ||
      !start_date ||
      !end_date ||
      !start_time ||
      !end_time ||
      !cate_id ||
      !cate_nm ||
      !location ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // =============================
    // CHECK IMAGE
    // =============================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Event image is required",
      });
    }

    // =============================
    // CHECK CATEGORY ID
    // =============================

    console.log("cate_id received:", cate_id);
    console.log("cate_nm received:", cate_nm);

    let category;

    try {
      category = await Category.findById(cate_id);
    } catch (categoryError) {
      console.error("CATEGORY FIND ERROR:", categoryError);

      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
        error: categoryError.message,
      });
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        cate_id: cate_id,
      });
    }

    console.log("CATEGORY FOUND:", category);

    // =============================
    // CREATE EVENT
    // =============================

    const event = new Event({
      title: title,
      start_date: start_date,
      end_date: end_date,
      start_time: start_time,
      end_time: end_time,
      price: Number(price) || 0,

      cate_id: category._id,
      cate_nm: category.name,

      location: location,
      description: description,

      image: req.file.filename,

      status: "active",
    });

    console.log("EVENT BEFORE SAVE:", event);

    // =============================
    // SAVE EVENT
    // =============================

    const savedEvent = await event.save();

    console.log("EVENT SAVED:", savedEvent);

    return res.status(201).json({
      success: true,
      message: "Event added successfully",
      data: savedEvent,
    });

  } catch (error) {
    console.error("========== ADD EVENT ERROR ==========");
    console.error(error);
    console.error("ERROR MESSAGE:", error.message);
    console.error("ERROR NAME:", error.name);
    console.error("====================================");

    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

// =====================================================
// GET ALL EVENTS
// =====================================================

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("cate_id", "name description status image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("GET EVENTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};


// =====================================================
// GET SINGLE EVENT
// =====================================================

export const getSingleEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id)
      .populate("cate_id", "name description status image");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event fetched successfully",
      data: event,
    });
  } catch (error) {
    console.error("GET SINGLE EVENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch event",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE EVENT
// =====================================================

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      start_date,
      end_date,
      start_time,
      end_time,
      price,
      cate_id,
      location,
      description,
      status,
    } = req.body;

    // -----------------------------
    // Find event
    // -----------------------------

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // -----------------------------
    // Find category
    // -----------------------------

    let category = null;

    if (cate_id) {
      category = await Category.findById(cate_id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      event.cate_id = category._id;
      event.cate_nm = category.name;
    }

    // -----------------------------
    // Update fields
    // -----------------------------

    if (title !== undefined) event.title = title;
    if (start_date !== undefined) event.start_date = start_date;
    if (end_date !== undefined) event.end_date = end_date;
    if (start_time !== undefined) event.start_time = start_time;
    if (end_time !== undefined) event.end_time = end_time;
    if (price !== undefined) event.price = Number(price) || 0;
    if (location !== undefined) event.location = location;
    if (description !== undefined) event.description = description;
    if (status !== undefined) event.status = status;

    // -----------------------------
    // Update image if new image
    // -----------------------------

    if (req.file) {
      event.image = req.file.filename;
    }

    const updatedEvent = await event.save();

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message,
    });
  }
};


// =====================================================
// DELETE EVENT
// =====================================================

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await Event.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message,
    });
  }
};


// =====================================================
// GET EVENTS BY CATEGORY
// =====================================================

export const getEventsByCategory = async (req, res) => {
  try {
    const { cate_nm } = req.params;

    const events = await Event.find({
      cate_nm: {
        $regex: new RegExp(`^${cate_nm}$`, "i"),
      },
    })
      .populate("cate_id", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Category events fetched successfully",
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("GET CATEGORY EVENTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch category events",
      error: error.message,
    });
  }
};