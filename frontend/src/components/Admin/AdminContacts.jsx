import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminContacts.css";

const AdminContacts = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================
  // FETCH CONTACTS
  // =========================================

  const fetchContacts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:9000/api/v1/contact/featch"
      );

      console.log("CONTACT DATA:", response.data);

      if (response.data.success) {
        setContacts(response.data.data || []);
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error("FETCH CONTACT ERROR:", error);

      if (error.response) {
        console.error("Backend Error:", error.response.data);
      }

      alert("Failed to fetch contact messages.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOAD DATA WHEN PAGE OPENS
  // =========================================

  useEffect(() => {
    fetchContacts();
  }, []);

  // =========================================
  // SEARCH + FILTER
  // =========================================

  const filteredContacts = contacts.filter((contact) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      contact.name?.toLowerCase().includes(searchText) ||
      contact.email?.toLowerCase().includes(searchText) ||
      contact.subject?.toLowerCase().includes(searchText) ||
      contact.phone?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      contact.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =========================================
  // DELETE CONTACT
  // =========================================

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the contact from ${name}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:9000/api/v1/contact/delete/${id}`
      );

      console.log("DELETE RESPONSE:", response.data);

      if (response.data.success) {
        alert(`Contact from ${name} deleted successfully.`);

        // Remove deleted contact from screen
        setContacts((prevContacts) =>
          prevContacts.filter((contact) => contact._id !== id)
        );
      }
    } catch (error) {
      console.error("DELETE CONTACT ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete contact."
      );
    }
  };

  // =========================================
  // VIEW MESSAGE
  // =========================================

  const handleView = async (contact) => {
    alert(
      `Name: ${contact.name}\n\n` +
        `Email: ${contact.email}\n\n` +
        `Phone: ${contact.phone || "Not provided"}\n\n` +
        `Subject: ${contact.subject}\n\n` +
        `Message: ${contact.message}`
    );

    // Mark Pending contact as Read
    if (contact.status === "Pending") {
      try {
        const response = await axios.put(
          `http://localhost:9000/api/v1/contact/status/${contact._id}`,
          {
            status: "Read",
          }
        );

        if (response.data.success) {
          setContacts((prevContacts) =>
            prevContacts.map((item) =>
              item._id === contact._id
                ? { ...item, status: "Read" }
                : item
            )
          );
        }
      } catch (error) {
        console.error("UPDATE STATUS ERROR:", error);
      }
    }
  };

  // =========================================
  // REPLY
  // =========================================

  const handleReply = async (contact) => {
    // Mark as Replied
    try {
      const response = await axios.put(
        `http://localhost:9000/api/v1/contact/status/${contact._id}`,
        {
          status: "Replied",
        }
      );

      if (response.data.success) {
        setContacts((prevContacts) =>
          prevContacts.map((item) =>
            item._id === contact._id
              ? { ...item, status: "Replied" }
              : item
          )
        );
      }
    } catch (error) {
      console.error("REPLY STATUS ERROR:", error);
    }

    // Open email
    window.location.href = `mailto:${contact.email}`;
  };

  // =========================================
  // DATE FORMAT
  // =========================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================
  // STATISTICS
  // =========================================

  const totalContacts = contacts.length;

  const newMessages = contacts.filter(
    (item) =>
      item.status === "Pending" ||
      item.status === "New"
  ).length;

  const repliedMessages = contacts.filter(
    (item) => item.status === "Replied"
  ).length;

  const today = new Date();

  const todayMessages = contacts.filter((item) => {
    if (!item.createdAt) {
      return false;
    }

    const contactDate = new Date(item.createdAt);

    return (
      contactDate.getDate() === today.getDate() &&
      contactDate.getMonth() === today.getMonth() &&
      contactDate.getFullYear() === today.getFullYear()
    );
  }).length;

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="admin-contacts">
        <div className="contacts-page-header">
          <div>
            <p className="contacts-small-title">
              CONTACT MANAGEMENT
            </p>

            <h1>Contacts</h1>

            <span>
              Manage customer enquiries and contact
              messages.
            </span>
          </div>
        </div>

        <div className="no-contacts">
          <div>⏳</div>
          <h2>Loading Contacts...</h2>
          <p>Please wait while contact messages are loading.</p>
        </div>
      </div>
    );
  }

  // =========================================
  // RETURN
  // =========================================

  return (
    <div className="admin-contacts">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="contacts-page-header">
        <div>
          <p className="contacts-small-title">
            CONTACT MANAGEMENT
          </p>

          <h1>Contacts</h1>

          <span>
            Manage customer enquiries and
            contact messages.
          </span>
        </div>
      </div>

      {/* =====================================
          STATISTICS
      ===================================== */}

      <div className="contacts-stats">

        {/* TOTAL */}

        <div className="contact-stat-card">
          <div className="contact-stat-icon">
            👥
          </div>

          <div>
            <span>Total Contacts</span>

            <strong>
              {totalContacts}
            </strong>
          </div>
        </div>

        {/* NEW */}

        <div className="contact-stat-card">
          <div className="contact-stat-icon">
            ✉
          </div>

          <div>
            <span>New Messages</span>

            <strong>
              {newMessages}
            </strong>
          </div>
        </div>

        {/* REPLIED */}

        <div className="contact-stat-card">
          <div className="contact-stat-icon">
            ✓
          </div>

          <div>
            <span>Replied</span>

            <strong>
              {repliedMessages}
            </strong>
          </div>
        </div>

        {/* TODAY */}

        <div className="contact-stat-card">
          <div className="contact-stat-icon">
            📅
          </div>

          <div>
            <span>Today's Messages</span>

            <strong>
              {todayMessages}
            </strong>
          </div>
        </div>

      </div>

      {/* =====================================
          SEARCH + FILTER
      ===================================== */}

      <div className="contacts-filter">

        {/* SEARCH */}

        <div className="contacts-search">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {/* STATUS */}

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="All">
            All Contacts
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Read">
            Read
          </option>

          <option value="Replied">
            Replied
          </option>
        </select>

      </div>

      {/* =====================================
          CONTACT TABLE
      ===================================== */}

      <div className="contacts-table-wrapper">

        <table className="contacts-table">

          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredContacts.length > 0 ? (

              filteredContacts.map((contact) => (

                <tr key={contact._id}>

                  {/* CUSTOMER */}

                  <td>

                    <div className="contact-customer">

                      <div className="customer-avatar">
                        {contact.name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>

                        <strong>
                          {contact.name}
                        </strong>

                        <span>
                          Customer #
                          {contact._id?.slice(-6)}
                        </span>

                      </div>

                    </div>

                  </td>

                  {/* CONTACT */}

                  <td>

                    <div className="contact-info">

                      <span>
                        {contact.email}
                      </span>

                      <span>
                        {contact.phone ||
                          "Not provided"}
                      </span>

                    </div>

                  </td>

                  {/* SUBJECT */}

                  <td>

                    <div className="contact-subject">

                      <strong>
                        {contact.subject}
                      </strong>

                      <p>
                        {contact.message?.length > 45
                          ? contact.message.substring(
                              0,
                              45
                            ) + "..."
                          : contact.message}
                      </p>

                    </div>

                  </td>

                  {/* DATE */}

                  <td>

                    <span className="contact-date">
                      {formatDate(
                        contact.createdAt
                      )}
                    </span>

                  </td>

                  {/* STATUS */}

                  <td>

                    <span
                      className={`contact-status ${
                        contact.status === "Pending"
                          ? "new"
                          : contact.status === "Replied"
                          ? "replied"
                          : "read"
                      }`}
                    >
                      {contact.status}
                    </span>

                  </td>

                  {/* ACTIONS */}

                  <td>

                    <div className="contact-actions">

                      {/* VIEW */}

                      <button
                        className="view-contact"
                        onClick={() =>
                          handleView(contact)
                        }
                        title="View"
                      >
                        👁
                      </button>

                      {/* REPLY */}

                      <button
                        className="reply-contact"
                        onClick={() =>
                          handleReply(contact)
                        }
                        title="Reply"
                      >
                        ↗
                      </button>

                      {/* DELETE */}

                      <button
                        className="delete-contact"
                        onClick={() =>
                          handleDelete(
                            contact._id,
                            contact.name
                          )
                        }
                        title="Delete"
                      >
                        🗑
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="6"
                  className="no-contacts"
                >

                  <div>🔍</div>

                  <h2>
                    No Contacts Found
                  </h2>

                  <p>
                    Try changing your search or
                    status filter.
                  </p>

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* =====================================
          FOOTER
      ===================================== */}

      <div className="contacts-footer">

        Showing{" "}

        <strong>
          {filteredContacts.length}
        </strong>

        {" "}of{" "}

        <strong>
          {contacts.length}
        </strong>

        {" "}contacts

      </div>

    </div>
  );
};

export default AdminContacts;