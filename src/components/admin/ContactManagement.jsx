import React, { useState, useEffect } from "react";
import { 
  Mail, 
  Search, 
  Filter, 
  Archive, 
  Trash2, 
  Eye, 
  EyeOff, 
  Reply,
  Calendar,
  RefreshCw,
  Plus,
  AlertCircle
} from "lucide-react";
import { toast } from "react-toastify";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [updatingId, setUpdatingId] = useState(null);
  const [serverError, setServerError] = useState(false);

  // Server URL - with better error handling
  const SERVER_URL = "http://localhost:5001";

  // Sample data for fallback
  const sampleMessages = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      message: "I'm interested in your martial arts products. Can you tell me more about the training equipment?",
      status: "unread",
      isArchived: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@example.com",
      message: "I have a question about my recent order. The tracking hasn't been updated for 3 days.",
      status: "read",
      isArchived: false,
      createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      message: "Do you offer bulk discounts for martial arts uniforms? We're looking to equip our entire dojo.",
      status: "replied",
      isArchived: true,
      createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    }
  ];

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterAndSortMessages();
  }, [messages, searchQuery, statusFilter, sortBy]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setServerError(false);
      
      console.log("Fetching messages from:", `${SERVER_URL}/contactMessages`);
      
      const response = await fetch(`${SERVER_URL}/contactMessages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Fetched messages:", data);
      
      // If no messages from server, use sample data
      if (!data || data.length === 0) {
        console.log("No messages from server, using sample data");
        setMessages(sampleMessages);
        // Save sample data to server for future use
        await initializeSampleData();
      } else {
        setMessages(data);
      }
      
    } catch (error) {
      console.error("Error fetching messages:", error);
      setServerError(true);
      
      // Use sample data as fallback
      console.log("Using sample data as fallback");
      setMessages(sampleMessages);
      
      toast.error(`Server connection failed. Using demo data. Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Initialize sample data on server
  const initializeSampleData = async () => {
    try {
      for (const message of sampleMessages) {
        await fetch(`${SERVER_URL}/contactMessages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });
      }
      console.log("Sample data initialized on server");
    } catch (error) {
      console.error("Error initializing sample data:", error);
    }
  };

  const filterAndSortMessages = () => {
    let filtered = messages.filter(message => {
      const matchesSearch = 
        message.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.message?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || message.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort messages
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "name":
          return (a.name || '').localeCompare(b.name || '');
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredMessages(filtered);
  };

  const updateMessageStatus = async (messageId, updates) => {
    if (!messageId) {
      toast.error("Invalid message ID");
      return;
    }

    setUpdatingId(messageId);
    
    try {
      // Update local state immediately for better UX
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId ? { ...msg, ...updates } : msg
        )
      );
      
      // Update selected message if it's the one being updated
      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage(prev => ({ ...prev, ...updates }));
      }

      // Try to update on server
      if (!serverError) {
        const response = await fetch(`${SERVER_URL}/contactMessages/${messageId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        console.log("Message updated on server:", messageId);
      }
      
      toast.success("Message updated successfully");
    } catch (error) {
      console.error("Error updating message:", error);
      toast.error(`Updated locally. Server update failed: ${error.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteMessage = async (messageId) => {
    if (!messageId) {
      toast.error("Invalid message ID");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this message?")) return;

    setUpdatingId(messageId);

    try {
      // Update local state immediately
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
      
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }

      // Try to delete from server
      if (!serverError) {
        const response = await fetch(`${SERVER_URL}/contactMessages/${messageId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }
      }
      
      toast.success("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error(`Deleted locally. Server delete failed: ${error.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const markAsRead = (messageId) => {
    updateMessageStatus(messageId, { status: "read" });
  };

  const markAsUnread = (messageId) => {
    updateMessageStatus(messageId, { status: "unread" });
  };

  const archiveMessage = (messageId) => {
    updateMessageStatus(messageId, { isArchived: true });
  };

  const unarchiveMessage = (messageId) => {
    updateMessageStatus(messageId, { isArchived: false });
  };

  const markAsReplied = (messageId) => {
    updateMessageStatus(messageId, { status: "replied" });
  };

  const handleMessageSelect = (message) => {
    setSelectedMessage(message);
    // Auto-mark as read when selected
    if (message.status === "unread") {
      markAsRead(message.id);
    }
  };

  // Add sample data for testing
  const addSampleMessage = async () => {
    const sampleMessage = {
      id: Date.now(),
      name: "Test User",
      email: "test@example.com",
      message: "This is a test message to verify the contact system is working properly.",
      status: "unread",
      isArchived: false,
      createdAt: new Date().toISOString()
    };

    try {
      // Update local state immediately
      setMessages(prev => [sampleMessage, ...prev]);
      
      // Try to save to server
      if (!serverError) {
        const response = await fetch(`${SERVER_URL}/contactMessages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sampleMessage),
        });

        if (response.ok) {
          console.log("Sample message saved to server");
        }
      }
      
      toast.success("Sample message added!");
    } catch (error) {
      console.error("Failed to add sample message to server:", error);
      toast.success("Sample message added locally!");
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      unread: { color: "bg-red-500", text: "Unread" },
      read: { color: "bg-blue-500", text: "Read" },
      replied: { color: "bg-green-500", text: "Replied" }
    };
    
    const config = statusConfig[status] || statusConfig.unread;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${config.color}`}>
        {config.text}
      </span>
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortBy("newest");
  };

  // Bulk actions
  const markAllAsRead = () => {
    const unreadMessages = messages.filter(msg => msg.status === "unread");
    if (unreadMessages.length === 0) {
      toast.info("No unread messages to mark as read");
      return;
    }

    unreadMessages.forEach(msg => {
      updateMessageStatus(msg.id, { status: "read" });
    });
    toast.success(`Marked ${unreadMessages.length} messages as read`);
  };

  // Test server connection
  const testServerConnection = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/contactMessages`);
      if (response.ok) {
        setServerError(false);
        toast.success("Server connection successful!");
        await fetchMessages(); // Refresh data
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (error) {
      setServerError(true);
      toast.error("Cannot connect to JSON Server. Using local data.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
          <p className="text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Contact Messages</h1>
              <p className="text-gray-400">
                Manage and respond to customer inquiries ({filteredMessages.length} messages)
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={addSampleMessage}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl transition-colors flex items-center gap-2"
                title="Add sample message for testing"
              >
                <Plus className="w-4 h-4" />
                Add Sample
              </button>
              <button
                onClick={testServerConnection}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-xl transition-colors flex items-center gap-2"
                title="Test server connection"
              >
                <RefreshCw className="w-4 h-4" />
                Test Connection
              </button>
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Mark All as Read
              </button>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        {serverError && (
          <div className="bg-red-900/20 border border-red-600 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-red-400 font-semibold">Server Connection Failed</p>
                  <p className="text-red-300 text-sm">
                    Using local data. Make sure JSON Server is running on port 5001.
                  </p>
                </div>
              </div>
              <button
                onClick={testServerConnection}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm flex items-center gap-2"
              >
                <RefreshCw className="w-3 h-3" />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">By Name</option>
            </select>

            {/* Stats and Clear Filters */}
            <div className="flex items-center gap-3">
              <div className="bg-gray-700 rounded-xl p-3 flex items-center justify-between flex-1">
                <span className="text-sm text-gray-300">Unread:</span>
                <span className="text-red-400 font-semibold">
                  {messages.filter(m => m.status === "unread").length}
                </span>
              </div>
              {(searchQuery || statusFilter !== "all" || sortBy !== "newest") && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-3 bg-gray-600 hover:bg-gray-700 rounded-xl transition-colors"
                  title="Clear all filters"
                >
                  <Filter className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-2xl p-4">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Messages ({filteredMessages.length})
              </h3>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                      selectedMessage?.id === message.id
                        ? "bg-red-500/20 border-red-500"
                        : message.status === "unread"
                        ? "bg-gray-700/50 border-gray-600"
                        : "bg-gray-700 border-gray-600"
                    } hover:bg-gray-700/70 ${
                      updatingId === message.id ? "opacity-50" : ""
                    }`}
                    onClick={() => handleMessageSelect(message)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {message.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{message.name || 'Unknown'}</h4>
                          <p className="text-sm text-gray-400">{message.email || 'No email'}</p>
                        </div>
                      </div>
                      {getStatusBadge(message.status)}
                    </div>
                    
                    <p className="text-gray-300 text-sm line-clamp-2 mb-2">
                      {message.message || 'No message content'}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(message.createdAt)}
                      </div>
                      {message.isArchived && (
                        <Archive className="w-3 h-3 text-yellow-500" />
                      )}
                    </div>
                  </div>
                ))}

                {filteredMessages.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No messages found</p>
                    {(searchQuery || statusFilter !== "all") && (
                      <button
                        onClick={clearFilters}
                        className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl transition-colors text-sm"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-gray-800 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedMessage.name || 'Unknown'}
                    </h2>
                    <p className="text-red-400">{selectedMessage.email || 'No email'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedMessage.status)}
                    {selectedMessage.isArchived && (
                      <span className="px-2 py-1 bg-yellow-500 rounded-full text-xs font-semibold text-white">
                        Archived
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 text-gray-400 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Received: {formatDate(selectedMessage.createdAt)}
                    </span>
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                      ID: {selectedMessage.id}
                    </span>
                  </div>
                  
                  <div className="bg-gray-700 rounded-xl p-4">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message || 'No message content'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {selectedMessage.status === "read" ? (
                    <button
                      onClick={() => markAsUnread(selectedMessage.id)}
                      disabled={updatingId === selectedMessage.id}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl transition-colors"
                    >
                      <EyeOff className="w-4 h-4" />
                      {updatingId === selectedMessage.id ? "Updating..." : "Mark Unread"}
                    </button>
                  ) : (
                    <button
                      onClick={() => markAsRead(selectedMessage.id)}
                      disabled={updatingId === selectedMessage.id}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 rounded-xl transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      {updatingId === selectedMessage.id ? "Updating..." : "Mark Read"}
                    </button>
                  )}

                  <button
                    onClick={() => markAsReplied(selectedMessage.id)}
                    disabled={updatingId === selectedMessage.id}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 rounded-xl transition-colors"
                  >
                    <Reply className="w-4 h-4" />
                    {updatingId === selectedMessage.id ? "Updating..." : "Mark Replied"}
                  </button>

                  {!selectedMessage.isArchived ? (
                    <button
                      onClick={() => archiveMessage(selectedMessage.id)}
                      disabled={updatingId === selectedMessage.id}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 rounded-xl transition-colors"
                    >
                      <Archive className="w-4 h-4" />
                      {updatingId === selectedMessage.id ? "Updating..." : "Archive"}
                    </button>
                  ) : (
                    <button
                      onClick={() => unarchiveMessage(selectedMessage.id)}
                      disabled={updatingId === selectedMessage.id}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 rounded-xl transition-colors"
                    >
                      <Archive className="w-4 h-4" />
                      {updatingId === selectedMessage.id ? "Updating..." : "Unarchive"}
                    </button>
                  )}

                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    disabled={updatingId === selectedMessage.id}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 rounded-xl transition-colors ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                    {updatingId === selectedMessage.id ? "Deleting..." : "Delete"}
                  </button>
                </div>

                {/* Quick Reply Section */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <h3 className="text-lg font-semibold mb-3">Quick Reply</h3>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      placeholder="Recipient email"
                      value={selectedMessage.email || ''}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white"
                    />
                    <button
                      onClick={() => {
                        window.open(`mailto:${selectedMessage.email}?subject=Re: Your message&body=Dear ${selectedMessage.name},%0D%0A%0D%0AThank you for your message.%0D%0A%0D%0ABest regards,%0D%0AYour Team`, '_blank');
                        markAsReplied(selectedMessage.id);
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <Reply className="w-4 h-4" />
                      Reply via Email
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-2xl p-12 text-center">
                <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  Select a Message
                </h3>
                <p className="text-gray-500">
                  Choose a message from the list to view details and take action
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;