import HeaderMenu from "../Model/HeaderMenuModel.js";

// =====================================================
// ADD HEADER MENU
// =====================================================

export const addHeaderMenu = async (req, res) => {
  try {
    const {
      name,
      slug,
      type,
      menuType,
      parentId,
      path,
      order,
      status,
    } = req.body;

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (!name || !slug || !type || !menuType) {
      return res.status(400).json({
        success: false,
        message:
          "Name, slug, type and menuType are required",
      });
    }

    // Single menu and submenu need path
    if (menuType === "single" && !path) {
      return res.status(400).json({
        success: false,
        message: "Path is required for single menu",
      });
    }

    // Dropdown parent normally does not need a path
    if (menuType === "dropdown" && parentId) {
      return res.status(400).json({
        success: false,
        message:
          "A dropdown menu cannot have a parent menu",
      });
    }

    // -------------------------------------------------
    // CHECK SLUG
    // -------------------------------------------------

    const existingMenu = await HeaderMenu.findOne({
      slug: slug.toLowerCase(),
    });

    if (existingMenu) {
      return res.status(400).json({
        success: false,
        message: "Menu with this slug already exists",
      });
    }

    // -------------------------------------------------
    // CHECK PARENT MENU
    // -------------------------------------------------

    if (parentId) {
      const parentMenu = await HeaderMenu.findById(
        parentId
      );

      if (!parentMenu) {
        return res.status(404).json({
          success: false,
          message: "Parent menu not found",
        });
      }

      // Parent itself should be a dropdown
      if (parentMenu.menuType !== "dropdown") {
        return res.status(400).json({
          success: false,
          message:
            "Selected parent menu must be a dropdown menu",
        });
      }
    }

    // -------------------------------------------------
    // CREATE MENU
    // -------------------------------------------------

    const menu = await HeaderMenu.create({
      name: name.trim(),
      slug: slug.toLowerCase().trim(),
      type,
      menuType,
      parentId: parentId || null,
      path: path || "",
      order: Number(order) || 0,
      status: status || "active",
    });

    return res.status(201).json({
      success: true,
      message: "Header menu added successfully",
      data: menu,
    });
  } catch (error) {
    console.error("ADD HEADER MENU ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL HEADER MENUS
// =====================================================

export const getHeaderMenus = async (req, res) => {
  try {
    const menus = await HeaderMenu.find()
      .populate("parentId", "name slug menuType")
      .sort({
        parentId: 1,
        order: 1,
      });

    return res.status(200).json({
      success: true,
      count: menus.length,
      data: menus,
    });
  } catch (error) {
    console.error("GET HEADER MENU ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// =====================================================
// GET ACTIVE HEADER MENUS
// =====================================================

export const getActiveHeaderMenus = async (req, res) => {
  try {
    const menus = await HeaderMenu.find({
      status: "active",
    })
      .populate("parentId", "name slug menuType")
      .sort({
        parentId: 1,
        order: 1,
      });

    return res.status(200).json({
      success: true,
      count: menus.length,
      data: menus,
    });
  } catch (error) {
    console.error(
      "GET ACTIVE HEADER MENU ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE HEADER MENU
// =====================================================

export const getHeaderMenuById = async (req, res) => {
  try {
    const menu = await HeaderMenu.findById(
      req.params.id
    ).populate(
      "parentId",
      "name slug menuType"
    );

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Header menu not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: menu,
    });
  } catch (error) {
    console.error(
      "GET HEADER MENU BY ID ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE HEADER MENU
// =====================================================

export const updateHeaderMenu = async (req, res) => {
  try {
    const {
      name,
      slug,
      type,
      menuType,
      parentId,
      path,
      order,
      status,
    } = req.body;

    // -------------------------------------------------
    // FIND MENU
    // -------------------------------------------------

    const menu = await HeaderMenu.findById(
      req.params.id
    );

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Header menu not found",
      });
    }

    // -------------------------------------------------
    // CHECK SLUG
    // -------------------------------------------------

    if (slug !== undefined) {
      const existingMenu =
        await HeaderMenu.findOne({
          slug: slug.toLowerCase(),
          _id: { $ne: req.params.id },
        });

      if (existingMenu) {
        return res.status(400).json({
          success: false,
          message:
            "Menu with this slug already exists",
        });
      }

      menu.slug = slug.toLowerCase().trim();
    }

    // -------------------------------------------------
    // UPDATE BASIC DATA
    // -------------------------------------------------

    if (name !== undefined) {
      menu.name = name.trim();
    }

    if (type !== undefined) {
      menu.type = type;
    }

    if (menuType !== undefined) {
      menu.menuType = menuType;
    }

    if (path !== undefined) {
      menu.path = path;
    }

    if (order !== undefined) {
      menu.order = Number(order);
    }

    if (status !== undefined) {
      menu.status = status;
    }

    // -------------------------------------------------
    // UPDATE PARENT
    // -------------------------------------------------

    if (parentId !== undefined) {
      const newParentId = parentId || null;

      // Menu cannot be its own parent
      if (
        newParentId &&
        newParentId.toString() ===
          req.params.id.toString()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "A menu cannot be its own parent",
        });
      }

      if (newParentId) {
        const parentMenu =
          await HeaderMenu.findById(
            newParentId
          );

        if (!parentMenu) {
          return res.status(404).json({
            success: false,
            message: "Parent menu not found",
          });
        }

        if (
          parentMenu.menuType !== "dropdown"
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Selected parent menu must be a dropdown menu",
          });
        }
      }

      menu.parentId = newParentId;
    }

    // -------------------------------------------------
    // VALIDATE MENU TYPE
    // -------------------------------------------------

    if (menu.menuType === "single" && !menu.path) {
      return res.status(400).json({
        success: false,
        message:
          "Path is required for single menu",
      });
    }

    if (
      menu.menuType === "dropdown" &&
      menu.parentId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A dropdown menu cannot have a parent",
      });
    }

    // -------------------------------------------------
    // SAVE
    // -------------------------------------------------

    await menu.save();

    return res.status(200).json({
      success: true,
      message:
        "Header menu updated successfully",
      data: menu,
    });
  } catch (error) {
    console.error(
      "UPDATE HEADER MENU ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE HEADER MENU
// =====================================================

export const deleteHeaderMenu = async (req, res) => {
  try {
    const menu = await HeaderMenu.findById(
      req.params.id
    );

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Header menu not found",
      });
    }

    // -------------------------------------------------
    // CHECK SUBMENUS
    // -------------------------------------------------

    const childMenus = await HeaderMenu.find({
      parentId: req.params.id,
    });

    if (childMenus.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete this menu because it has submenu items. Delete or move the submenu items first.",
      });
    }

    // -------------------------------------------------
    // DELETE
    // -------------------------------------------------

    await HeaderMenu.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Header menu deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE HEADER MENU ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};