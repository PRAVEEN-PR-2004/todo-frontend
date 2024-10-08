import { useState, useEffect } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(-1);
  const [message, setMessage] = useState("");

  // Edit
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "https://todo-backend-awza.onrender.com/todos"; // Ensure this is the correct port

  const handleSubmit = () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => res.json())
        .then((data) => {
          getItems();
          setTitle("");
          setDescription("");
          setMessage("Item added successfully");
          setTimeout(() => {
            setMessage("");
          }, 3000);
        })
        .catch((error) => {
          setError("Unable to create todo item");
        });
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setTodos(data);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
        setError("Unable to fetch todos");
      });
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleUpdate = () => {
    setError("");
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(`${apiUrl}/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      })
        .then((res) => res.json())
        .then(() => {
          getItems();
          setMessage("Item updated successfully");
          setTimeout(() => {
            setMessage("");
          }, 3000);
          setEditId(-1);
        })
        .catch((error) => {
          setError("Unable to update todo item");
        });
    }
  };

  const handleEditCancel = () => {
    setEditId(-1);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          getItems();
          setMessage("Item deleted successfully");
          setTimeout(() => {
            setMessage("");
          }, 3000);
        })
        .catch((error) => {
          setError("Unable to delete todo item");
        });
    }
  };

  return (
    <div className="container">
      <div
        className="row p-3 mb-5 bg-dark text-light text-center"
        style={{ backgroundColor: "#B0C4DE" }}
      >
        <h1>TODO-LIST</h1>
      </div>

      <div className="row">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
          <input
            name="title"
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="form-control"
            type="text"
          />
          <input
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="form-control"
            type="text"
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>

      <div className="row mt-3">
        <h3>TODO</h3>
        <ul className="list-group">
          {todos.map((item) => (
            <li
              key={item._id}
              className="list-group-item d-flex justify-content-between align-items-center my-2"
              style={{ backgroundColor: "#B0C4DE" }}
            >
              <div className="d-flex flex-column me-2">
                {editId !== item._id ? (
                  <>
                    <span className="fw-bold">{item.title}</span>
                    <span>{item.description}</span>
                  </>
                ) : (
                  <div className="form-group d-flex gap-2">
                    <input
                      name="editTitle"
                      placeholder="Title"
                      onChange={(e) => setEditTitle(e.target.value)}
                      value={editTitle}
                      className="form-control"
                      type="text"
                    />
                    <input
                      placeholder="Description"
                      onChange={(e) => setEditDescription(e.target.value)}
                      value={editDescription}
                      className="form-control"
                      type="text"
                    />
                  </div>
                )}
              </div>
              <div className="d-flex gap-2">
                {editId !== item._id ? (
                  <button
                    className="btn"
                    style={{ backgroundColor: "#1F305E", color: "white" }}
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    className="btn"
                    onClick={handleUpdate}
                    style={{ backgroundColor: "#002D72", color: "white" }}
                  >
                    Update
                  </button>
                )}
                {editId !== item._id ? (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                ) : (
                  <button className="btn btn-danger" onClick={handleEditCancel}>
                    Cancel
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
