import React, { useState } from "react";

const KnowledgePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const categories = [
    { id: "all", name: "All Categories", count: 45 },
    { id: "account", name: "Account & Login", count: 12 },
    { id: "hardware", name: "Hardware Issues", count: 8 },
    { id: "software", name: "Software Support", count: 15 },
    { id: "network", name: "Network & Connectivity", count: 6 },
    { id: "security", name: "Security & Privacy", count: 4 },
  ];

  const articles = [
    {
      id: "1",
      title: "How to Reset Your Password",
      summary: "Complete guide to password reset procedure",
      category: "account",
      author: "Jane Smith",
      status: "published",
      rating: 4.5,
      views: 245,
      lastUpdated: "2024-01-15",
    },
    {
      id: "2",
      title: "VPN Connection Setup Guide",
      summary: "Step-by-step instructions for VPN configuration",
      category: "network",
      author: "Mike Johnson",
      status: "published",
      rating: 4.2,
      views: 189,
      lastUpdated: "2024-01-12",
    },
    {
      id: "3",
      title: "Troubleshooting Printer Issues",
      summary: "Common printer problems and solutions",
      category: "hardware",
      author: "Sarah Wilson",
      status: "published",
      rating: 4.0,
      views: 156,
      lastUpdated: "2024-01-10",
    },
    {
      id: "4",
      title: "Software Installation Guidelines",
      summary: "How to request and install approved software",
      category: "software",
      author: "John Doe",
      status: "draft",
      rating: 0,
      views: 0,
      lastUpdated: "2024-01-08",
    },
    {
      id: "5",
      title: "Email Security Best Practices",
      summary: "Protecting your email from phishing and malware",
      category: "security",
      author: "Alice Brown",
      status: "published",
      rating: 4.8,
      views: 312,
      lastUpdated: "2024-01-05",
    },
    {
      id: "6",
      title: "Mobile Device Management",
      summary: "Setting up and managing company mobile devices",
      category: "hardware",
      author: "Bob Davis",
      status: "published",
      rating: 4.3,
      views: 134,
      lastUpdated: "2024-01-03",
    },
  ];

  const topArticles = articles
    .filter((article) => article.status === "published")
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const recentArticles = articles
    .sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    )
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "#10b981";
      case "draft":
        return "#f59e0b";
      case "archived":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "account":
        return "👤";
      case "hardware":
        return "🖥️";
      case "software":
        return "💻";
      case "network":
        return "🌐";
      case "security":
        return "🔒";
      default:
        return "📄";
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? "#fbbf24" : "#d1d5db" }}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="compact-page">
      {/* Header */}
      <div className="compact-header">
        <h1>Knowledge Base</h1>
        <div className="compact-actions">
          <div className="compact-search">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="compact-search-input"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="compact-select"
          >
            <option value="all">All Categories</option>
            <option value="account">Account & Login</option>
            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
            <option value="network">Network</option>
            <option value="security">Security</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="compact-select"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <button className="compact-btn compact-btn-primary">
            New Article
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="compact-grid compact-grid-4">
        <div className="compact-card">
          <h3>Total Articles</h3>
          <div className="compact-stats-value">45</div>
        </div>
        <div className="compact-card">
          <h3>Published</h3>
          <div className="compact-stats-value">38</div>
        </div>
        <div className="compact-card">
          <h3>Total Views</h3>
          <div className="compact-stats-value">1,536</div>
        </div>
        <div className="compact-card">
          <h3>Avg Rating</h3>
          <div className="compact-stats-value">4.3</div>
        </div>
      </div>

      {/* Content */}
      <div className="compact-grid compact-grid-3">
        {/* Categories */}
        <div className="compact-card">
          <h3>Categories</h3>
          <div className="compact-category-list">
            {categories.map((category) => (
              <div key={category.id} className="compact-category-item">
                <span className="compact-category-icon">
                  {getCategoryIcon(category.id)}
                </span>
                <span className="compact-category-name">{category.name}</span>
                <span className="compact-category-count">{category.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Articles */}
        <div className="compact-card">
          <h3>Most Popular</h3>
          <div className="compact-article-list">
            {topArticles.map((article) => (
              <div key={article.id} className="compact-article-item">
                <div className="compact-article-header">
                  <span className="compact-article-title">{article.title}</span>
                  <span className="compact-article-views">
                    {article.views} views
                  </span>
                </div>
                <div className="compact-article-meta">
                  <span className="compact-article-category">
                    {getCategoryIcon(article.category)} {article.category}
                  </span>
                  <div className="compact-article-rating">
                    {renderStars(article.rating)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Articles */}
        <div className="compact-card">
          <h3>Recent Updates</h3>
          <div className="compact-article-list">
            {recentArticles.map((article) => (
              <div key={article.id} className="compact-article-item">
                <div className="compact-article-header">
                  <span className="compact-article-title">{article.title}</span>
                  <span
                    className="compact-article-status"
                    style={{ color: getStatusColor(article.status) }}
                  >
                    {article.status}
                  </span>
                </div>
                <div className="compact-article-meta">
                  <span className="compact-article-author">
                    by {article.author}
                  </span>
                  <span className="compact-article-date">
                    {article.lastUpdated}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Articles */}
      <div className="compact-card">
        <h3>All Articles</h3>
        <div className="compact-table-container">
          <table className="compact-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Views</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td>
                    <div className="compact-article-title-cell">
                      <div className="compact-article-title">
                        {article.title}
                      </div>
                      <div className="compact-article-summary">
                        {article.summary}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="compact-category-badge">
                      {getCategoryIcon(article.category)} {article.category}
                    </span>
                  </td>
                  <td>{article.author}</td>
                  <td>
                    <span
                      className="compact-status-badge"
                      style={{ color: getStatusColor(article.status) }}
                    >
                      {article.status}
                    </span>
                  </td>
                  <td>
                    <div className="compact-rating">
                      {renderStars(article.rating)}
                      <span className="compact-rating-value">
                        {article.rating > 0 ? article.rating : "N/A"}
                      </span>
                    </div>
                  </td>
                  <td>{article.views}</td>
                  <td>{article.lastUpdated}</td>
                  <td>
                    <div className="compact-actions">
                      <button className="compact-btn compact-btn-sm compact-btn-primary">
                        View
                      </button>
                      <button className="compact-btn compact-btn-sm compact-btn-secondary">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export { KnowledgePage };
export default KnowledgePage;
