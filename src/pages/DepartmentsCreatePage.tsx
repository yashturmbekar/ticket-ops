import React, { useState, useEffect } from "react";
import { Modal, Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import HelpdeskDepartmentCreateForm from "../features/departments/components/HelpdeskDepartmentCreateForm";
import type { HelpdeskDepartmentPayload } from "../features/departments/components/HelpdeskDepartmentCreateForm";
import { createHelpdeskDepartment, getHelpdeskDepartmentsById } from "../services/helpdeskDepartmentService";
import { getHelpdeskDepartmentsList } from "../services/helpdeskDepartmentService";

// Add proper response type
interface Department {
  id: string;
  name: string;
  isActive: boolean;
  createdDate: string;
  lastModifiedDate?: string;
}

interface DepartmentsListMeta {
  totalPages?: number;
  itemsPerPage?: number;
}

interface DepartmentsListResponse {
  items: Department[];
  meta: DepartmentsListMeta;
}

const DepartmentsCreatePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showList, setShowList] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDepartment, setEditDepartment] = useState<Department | null>(null);
  // Fetch department by id (for edit)
  const fetchDepartmentById = async (id: string) => {
    try {
      // You need to implement this API in your service layer
      const res: any = await getHelpdeskDepartmentsById(id);
      // If paginated, get first item; else, fallback
      if (Array.isArray(res.items) && res.items.length > 0) {
        setEditDepartment(res.items[0]);
      } else if (Array.isArray(res) && res.length > 0) {
        setEditDepartment(res[0]);
      } else {
        setEditDepartment(null);
      }
      setEditModalOpen(true);
    } catch (e) {
      setEditDepartment(null);
      setEditModalOpen(false);
    }
  };  

  // Type guard for paginated response
  function isPaginatedResponse(obj: any): obj is { items: Department[]; meta: DepartmentsListMeta } {
    return obj && Array.isArray(obj.items) && typeof obj.meta === 'object';
  }

  const fetchDepartmentList = async (pageNum = 1) => {
    let payload = {
      orgId: "101", // Replace with actual orgId
      name: "",
      isActive: true,
      page: pageNum - 1, // backend is 0-based
      size: itemsPerPage,
    };

    try {
      const res: any = await getHelpdeskDepartmentsList(payload);
      setShowList(true);
      if (isPaginatedResponse(res)) {
        setDepartments(res.items);
        setTotalPages(res.meta?.totalPages || 1);
        setItemsPerPage(res.meta?.itemsPerPage || 10);
      } else {
        setDepartments([]);
        setTotalPages(1);
      }
      // Debug log
      // console.log('Departments API response:', res);
    } catch (e) {
      setDepartments([]);
      setTotalPages(1);
      // Optionally handle error
      // console.error('Failed to fetch departments', e);
    }
  };

  useEffect(() => {
    fetchDepartmentList(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSubmit = async (payload: HelpdeskDepartmentPayload) => {
    setLoading(true);
    setError(null);
    try {
      await createHelpdeskDepartment(payload);
      await fetchDepartmentList(page);
      setShowList(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to create department");
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };
  const handleGoToPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (val >= 1 && val <= totalPages) setPage(val);
  };

  return (
    <div style={{ padding: 32 }}>
      <HelpdeskDepartmentCreateForm onSubmit={handleSubmit} loading={loading} error={error} />
      {showList && (
        <div style={{ marginTop: 40 }}>
          <h2>Departments</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>ID</th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>Name</th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>Active</th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>Created Date</th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>Last Modified</th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>Edit</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept: Department) => (
                <tr key={dept.id}>
                  <td style={{ padding: 8 }}>{dept.id}</td>
                  <td style={{ padding: 8 }}>{dept.name}</td>
                  <td style={{ padding: 8 }}>{dept.isActive ? "Yes" : "No"}</td>
                  <td style={{ padding: 8 }}>{dept.createdDate ? new Date(dept.createdDate).toLocaleString() : "-"}</td>
                  <td style={{ padding: 8 }}>{dept.lastModifiedDate ? new Date(dept.lastModifiedDate).toLocaleString() : "-"}</td>
                  <td style={{ padding: 8 }}>
                    <IconButton aria-label="edit" onClick={() => fetchDepartmentById(dept.id)}>
                      <EditIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16 }}>
            <button onClick={handlePrevPage} disabled={page === 1}>Prev</button>
            <span>Page</span>
            <input type="number" min={1} max={totalPages} value={page} onChange={handleGoToPage} style={{ width: 50 }} />
            <span>of {totalPages}</span>
            <button onClick={handleNextPage} disabled={page === totalPages}>Next</button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, minWidth: 400 }}>
          <HelpdeskDepartmentCreateForm
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            initialData={editDepartment}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default DepartmentsCreatePage;
