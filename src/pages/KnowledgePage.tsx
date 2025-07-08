import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaBook,
  FaFileAlt,
  FaTag,
} from "react-icons/fa";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { PageLayout } from "../components/common/PageLayout";
import type { KnowledgeArticle } from "../types";
import { ArticleStatus } from "../types";
import "../styles/knowledge.css";

export const KnowledgePage: React.FC = () => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<KnowledgeArticle[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  const [statusFilter, setStatusFilter] = useState<
    keyof typeof ArticleStatus | "all"
  >("all");
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockArticles: KnowledgeArticle[] = [
      {
        id: "1",
        title: "How to Reset Your Password",
        content:
          "This article explains the step-by-step process to reset your password...",
        summary: "Complete guide to password reset procedure",
        categoryId: "account",
        authorId: "jane.smith@company.com",
        status: ArticleStatus.PUBLISHED,
        tags: ["password", "account", "security"],
        isPublic: true,
        viewCount: 245,
        rating: 4.5,
        ratingCount: 12,
        createdAt: new Date("2023-12-01T10:00:00Z"),
        updatedAt: new Date("2024-01-10T15:30:00Z"),
        publishedAt: new Date("2024-01-10T15:30:00Z"),
        version: 1,
      },
      {
        id: "2",
        title: "Setting up VPN Connection",
        content: "Learn how to configure VPN connection for remote work...",
        summary: "VPN setup guide for secure remote access",
        categoryId: "network",
        authorId: "mike.wilson@company.com",
        status: ArticleStatus.PUBLISHED,
        tags: ["vpn", "network", "remote-work"],
        isPublic: true,
        viewCount: 189,
        rating: 4.8,
        ratingCount: 15,
        createdAt: new Date("2023-11-15T14:00:00Z"),
        updatedAt: new Date("2024-01-05T11:20:00Z"),
        publishedAt: new Date("2024-01-05T11:20:00Z"),
        version: 1,
      },
      {
        id: "3",
        title: "Printer Troubleshooting Guide",
        content: "Common printer issues and their solutions...",
        summary: "Comprehensive guide to resolve printer problems",
        categoryId: "hardware",
        authorId: "lisa.garcia@company.com",
        status: ArticleStatus.REVIEW,
        tags: ["printer", "hardware", "troubleshooting"],
        isPublic: false,
        viewCount: 156,
        rating: 4.2,
        ratingCount: 8,
        createdAt: new Date("2023-12-15T09:00:00Z"),
        updatedAt: new Date("2023-12-20T16:45:00Z"),
        version: 2,
      },
      {
        id: "4",
        title: "Email Configuration for Mobile Devices",
        content:
          "Step-by-step guide to set up company email on mobile devices...",
        summary: "Mobile email setup for iOS and Android",
        categoryId: "email",
        authorId: "jane.smith@company.com",
        status: ArticleStatus.PUBLISHED,
        tags: ["email", "mobile", "configuration"],
        isPublic: true,
        viewCount: 312,
        rating: 4.7,
        ratingCount: 23,
        createdAt: new Date("2023-10-20T11:30:00Z"),
        updatedAt: new Date("2024-01-12T09:15:00Z"),
        publishedAt: new Date("2024-01-12T09:15:00Z"),
        version: 1,
      },
      {
        id: "5",
        title: "Software Installation Policies",
        content:
          "Guidelines and procedures for software installation requests...",
        summary: "Company policies for software installation",
        categoryId: "policies",
        authorId: "admin@company.com",
        status: ArticleStatus.DRAFT,
        tags: ["software", "policies", "installation"],
        isPublic: false,
        viewCount: 67,
        rating: 0,
        ratingCount: 0,
        createdAt: new Date("2024-01-10T08:00:00Z"),
        updatedAt: new Date("2024-01-14T10:30:00Z"),
        version: 1,
      },
    ];

    setTimeout(() => {
      setArticles(mockArticles);
      setFilteredArticles(mockArticles);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter articles based on search and filters
  useEffect(() => {
    let filtered = articles;

    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (article) => article.categoryId === categoryFilter
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (article) => article.status === ArticleStatus[statusFilter]
      );
    }

    setFilteredArticles(filtered);
  }, [articles, searchTerm, categoryFilter, statusFilter]);

  const getStatusColor = (status: ArticleStatus) => {
    switch (status) {
      case ArticleStatus.PUBLISHED:
        return "status-published";
      case ArticleStatus.DRAFT:
        return "status-draft";
      case ArticleStatus.REVIEW:
        return "status-review";
      case ArticleStatus.ARCHIVED:
        return "status-archived";
      default:
        return "status-draft";
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case "hardware":
        return <FaBook />;
      case "software":
        return <FaFileAlt />;
      case "network":
        return <FaBook />;
      case "email":
        return <FaFileAlt />;
      case "account":
        return <FaBook />;
      case "policies":
        return <FaFileAlt />;
      default:
        return <FaBook />;
    }
  };

  const getUniqueCategories = () => {
    const categories = articles.map((article) => article.categoryId);
    return [...new Set(categories)];
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="star filled">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half">
          ★
        </span>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star empty">
          ★
        </span>
      );
    }

    return stars;
  };

  const handleCreateArticle = () => {
    // TODO: Implement create article modal
    console.log("Create article");
  };

  const handleViewArticle = (articleId: string) => {
    // TODO: Navigate to article details
    console.log("View article", articleId);
  };

  const handleEditArticle = (articleId: string) => {
    // TODO: Open edit article modal
    console.log("Edit article", articleId);
  };

  const handleDeleteArticle = (articleId: string) => {
    // TODO: Implement delete confirmation
    console.log("Delete article", articleId);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="loading-spinner">Loading knowledge base...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="knowledge-page">
        <div className="page-header">
          <h1>Knowledge Base</h1>
        </div>

        <div className="knowledge-header">
          <div className="knowledge-actions">
            <Button
              variant="primary"
              icon={<FaPlus />}
              onClick={handleCreateArticle}
            >
              New Article
            </Button>
          </div>

          <div className="knowledge-filters">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {getUniqueCategories().map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as keyof typeof ArticleStatus | "all"
                )
              }
            >
              <option value="all">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="REVIEW">Under Review</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        <div className="knowledge-stats">
          <Card className="stat-card">
            <div className="stat-content">
              <h3>Total Articles</h3>
              <p className="stat-number">{articles.length}</p>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="stat-content">
              <h3>Published</h3>
              <p className="stat-number">
                {
                  articles.filter((a) => a.status === ArticleStatus.PUBLISHED)
                    .length
                }
              </p>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="stat-content">
              <h3>Under Review</h3>
              <p className="stat-number">
                {
                  articles.filter((a) => a.status === ArticleStatus.REVIEW)
                    .length
                }
              </p>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="stat-content">
              <h3>Categories</h3>
              <p className="stat-number">{getUniqueCategories().length}</p>
            </div>
          </Card>
        </div>

        <div className="articles-grid">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="article-card">
              <div className="article-header">
                <div className="article-icon">
                  {getCategoryIcon(article.categoryId)}
                </div>
                <div className="article-meta">
                  <span
                    className={`status-badge ${getStatusColor(article.status)}`}
                  >
                    {article.status}
                  </span>
                  <span className="category">{article.categoryId}</span>
                </div>
              </div>

              <div className="article-content">
                <h3 className="article-title">{article.title}</h3>
                <p className="article-summary">{article.summary}</p>

                <div className="article-tags">
                  {article.tags.map((tag) => (
                    <span key={tag} className="tag">
                      <FaTag />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="article-stats">
                  <div className="rating">
                    {renderStars(article.rating)}
                    <span className="rating-text">({article.ratingCount})</span>
                  </div>
                  <div className="views">
                    <FaEye />
                    <span>{article.viewCount} views</span>
                  </div>
                </div>
              </div>

              <div className="article-actions">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<FaEye />}
                  onClick={() => handleViewArticle(article.id)}
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<FaEdit />}
                  onClick={() => handleEditArticle(article.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<FaTrash />}
                  onClick={() => handleDeleteArticle(article.id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};
