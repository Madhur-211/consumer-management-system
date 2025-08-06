"use client";
import { useEffect, useState } from "react";

export default function ConsumersPage() {
  const [consumers, setConsumers] = useState([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [createData, setCreateData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    date_of_birth: "",
    gender: "",
    status: "ACTIVE",
  });

  const [editData, setEditData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    date_of_birth: "",
    gender: "",
    status: "",
  });

  const fetchConsumers = async () => {
    const res = await fetch("http://localhost:3000/consumers", {
      method: "GET",
      credentials: "include",
    });
    const json = await res.json();
    setConsumers(json);
  };

  useEffect(() => {
    fetchConsumers();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    isEdit = false
  ) => {
    const { name, value } = e.target;
    isEdit
      ? setEditData((prev) => ({ ...prev, [name]: value }))
      : setCreateData((prev) => ({ ...prev, [name]: value }));
  };

  const createConsumer = async () => {
    const payload = Object.fromEntries(
      Object.entries(createData).filter(([, value]) => value !== "")
    );

    const res = await fetch("http://localhost:3000/consumers", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setCreateData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        date_of_birth: "",
        gender: "",
        status: "ACTIVE",
      });
      fetchConsumers();
    }
  };

  const updateConsumer = async () => {
    if (!selectedId) return;

    const payload = Object.fromEntries(
      Object.entries(editData).filter(([, value]) => value !== "")
    );

    const res = await fetch(`http://localhost:3000/consumers/${selectedId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setSelectedId(null);
      setEditData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        date_of_birth: "",
        gender: "",
        status: "",
      });
      fetchConsumers();
    }
  };

  const deleteConsumer = async (id: string) => {
    const res = await fetch(`http://localhost:3000/consumers/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) fetchConsumers();
  };

  const toggleBlock = async (id: string) => {
    const res = await fetch(`http://localhost:3000/consumers/${id}/block`, {
      method: "PATCH",
      credentials: "include",
    });
    if (res.ok) fetchConsumers();
  };

  const toggleTest = async (id: string) => {
    const res = await fetch(`http://localhost:3000/consumers/${id}/test`, {
      method: "PATCH",
      credentials: "include",
    });
    if (res.ok) fetchConsumers();
  };

  const loadConsumer = async (id: string) => {
    const res = await fetch(`http://localhost:3000/consumers/${id}`, {
      method: "GET",
      credentials: "include",
    });
    const json = await res.json();
    setSelectedId(json.consumer_id);
    setEditData({
      first_name: json.first_name || "",
      last_name: json.last_name || "",
      email: json.email || "",
      phone: json.phone || "",
      address: json.address || "",
      date_of_birth: json.date_of_birth || "",
      gender: json.gender || "",
      status: json.status || "",
    });
  };

  return (
    <div>
      <h1 style={{ fontSize: "30px" }}>Consumers</h1>
      <br />
      <ul>
        {consumers.map((c: any) => (
          <li key={c.consumer_id}>
            {c.consumer_id} - {c.first_name} - {c.last_name} - {c.email} - {c.phone} - {c.address}{" "}
            - {c.date_of_birth} - {c.gender} - {c.status} -{" "}
            {c.is_blocked ? "Blocked" : "Unblocked"} -{" "}
            {c.is_test_consumer ? "Test Consumer" : "Normal Consumer"}
            <div>
              <button className="bg-blue-500 text-white px-2 py-2 mx-2" onClick={() => loadConsumer(c.consumer_id)}>Edit</button>
              <button className="bg-blue-500 text-white px-2 py-2 mx-2" onClick={() => deleteConsumer(c.consumer_id)}>
                Delete
              </button>
              <button className="bg-blue-500 text-white px-2 py-2 mx-2" onClick={() => toggleBlock(c.consumer_id)}>
                {c.is_blocked ? "Unblock" : "Block"}
              </button>
              <button className="bg-blue-500 text-white px-2 py-2 mx-2" onClick={() => toggleTest(c.consumer_id)}>
                {c.is_test_consumer ? "Change to normal" : "Change to test"}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <br />
      {/* Edit Consumer */}
      {selectedId && (
        <div>
          <h2>Edit Consumer</h2>
          <input
            placeholder="First Name"
            name="first_name"
            value={editData.first_name}
            onChange={(e) => handleInputChange(e, true)}
          />
          <input
            placeholder="Last Name"
            name="last_name"
            value={editData.last_name}
            onChange={(e) => handleInputChange(e, true)}
          />
          <input
            placeholder="Email"
            name="email"
            value={editData.email}
            onChange={(e) => handleInputChange(e, true)}
          />
          <input
            placeholder="Phone"
            name="phone"
            value={editData.phone}
            onChange={(e) => handleInputChange(e, true)}
          />
          <input
            placeholder="Address"
            name="address"
            value={editData.address}
            onChange={(e) => handleInputChange(e, true)}
          />
          <input
            type="date"
            name="date_of_birth"
            value={editData.date_of_birth}
            onChange={(e) => handleInputChange(e, true)}
          />
          <input
            placeholder="Gender"
            name="gender"
            value={editData.gender}
            onChange={(e) => handleInputChange(e, true)}
          />
          <div>
            <label>Status:</label>
            <input
              type="radio"
              name="status"
              value="ACTIVE"
              checked={editData.status === "ACTIVE"}
              onChange={(e) => handleInputChange(e, true)}
            />
            Active
            <input
              type="radio"
              name="status"
              value="INACTIVE"
              checked={editData.status === "INACTIVE"}
              onChange={(e) => handleInputChange(e, true)}
            />
            Inactive
          </div>
          <button className="bg-blue-500 text-white px-2 py-2 mx-2" onClick={updateConsumer}>Update</button>
          <button className="bg-blue-500 text-white px-2 py-2 mx-2"onClick={() => setSelectedId(null)}>Cancel</button>
        </div>
      )}
      <br />
      {/* Create Consumer */}
      <div>
        <h2>Create Consumer</h2>
        <input
          placeholder="First Name"
          name="first_name"
          value={createData.first_name}
          onChange={handleInputChange}
        />
        <input
          placeholder="Last Name"
          name="last_name"
          value={createData.last_name}
          onChange={handleInputChange}
        />
        <input
          placeholder="Email"
          name="email"
          value={createData.email}
          onChange={handleInputChange}
        />
        <input
          placeholder="Phone"
          name="phone"
          value={createData.phone}
          onChange={handleInputChange}
        />
        <input
          placeholder="Address"
          name="address"
          value={createData.address}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="date_of_birth"
          value={createData.date_of_birth}
          onChange={handleInputChange}
        />
        <input
          placeholder="Gender"
          name="gender"
          value={createData.gender}
          onChange={handleInputChange}
        />
        {/* <div>
          <label>Status:</label>
          <input
            type="radio"
            name="status"
            value="ACTIVE"
            checked={createData.status === "ACTIVE"}
            onChange={handleInputChange}
          />
          Active
          <input
            type="radio"
            name="status"
            value="INACTIVE"
            checked={createData.status === "INACTIVE"}
            onChange={handleInputChange}
          />
          Inactive
        </div> */}
        <button className="bg-blue-500 text-white px-2 py-2 mx-2"onClick={createConsumer}>Create</button>
      </div>
    </div>
  );
}


