import React, { useEffect, useState } from "react";
import axios from "axios";
import "./list.css";

const List = () => {
    const [list, setList] = useState([]);
    const [imageUrls, setImageUrls] = useState({});
    const [deletingId, setDeletingId] = useState(null);
    const token = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzM4MjE0MDY0LCJleHAiOjE3MzgyMTU4NjR9.h-NtRbeLwg2vLbS6zY6RZCMGmY5VOdRhXlF4URJQzdKuB6G28j8QKyx1RAgkZcnw";
    const backendUrl = "http://localhost:8080";

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(`${backendUrl}/food/products`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const productsWithEditState = response.data.map(product => ({
                    ...product,
                    isEditing: false,
                    editData: null
                }));
                setList(productsWithEditState);
                fetchProductsImages(productsWithEditState);
            } catch (error) {
                console.error('Error fetching items:', error);
                alert('Failed to load products');
            }
        };
        fetchItems();
    }, []);

    const fetchProductsImages = (products) => {
        products.forEach((product) => {
            const imageUrl = `${backendUrl}/food/product/${product.id}/image`;
            axios.get(imageUrl, {
                responseType: "blob",
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((response) => {
                const imageObjectUrl = URL.createObjectURL(response.data);
                setImageUrls(prev => ({ 
                    ...prev, 
                    [product.id]: imageObjectUrl 
                }));
            })
            .catch((error) => {
                console.error("Error fetching product image:", error);
            });
        });
    };

    const deleteItem = async (id) => {
        try {
            setDeletingId(id);
            await axios.delete(`${backendUrl}/food/product/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setList(list.filter(item => item.id !== id));
            URL.revokeObjectURL(imageUrls[id]);
            setImageUrls(prev => {
                const newUrls = {...prev};
                delete newUrls[id];
                return newUrls;
            });
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete product');
        } finally {
            setDeletingId(null);
        }
    };

    const toggleEdit = async (item) => {
        const product = list.find(p => p.id === item.id);
        if (!product.isEditing) {
            try {
                const imageResponse = await axios.get(`${backendUrl}/food/product/${item.id}/image`, {
                    responseType: 'blob',
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const file = new File([imageResponse.data], 'product-image.jpg', {
                    type: imageResponse.data.type
                });

                setList(prevList => prevList.map(p => 
                    p.id === item.id 
                        ? { ...p, 
                            isEditing: true, 
                            editData: {
                                name: p.name,
                                category: p.category,
                                price: p.price,
                                description: p.description || "",
                                imageFile: file
                            }} 
                        : p
                ));
            } catch (error) {
                console.error('Error entering edit mode:', error);
                alert('Failed to load product for editing');
            }
        } else {
            setList(prevList => prevList.map(p => 
                p.id === item.id 
                    ? { ...p, isEditing: false, editData: null } 
                    : p
            ));
        }
    };

    const handleEditChange = (e, itemId) => {
        setList(prevList => prevList.map(p => {
            if (p.id === itemId) {
                return {
                    ...p,
                    editData: {
                        ...p.editData,
                        [e.target.name]: e.target.value
                    }
                };
            }
            return p;
        }));
    };

    const handleImageChange = (e, itemId) => {
        const file = e.target.files[0];
        if (!file) return;

        if (imageUrls[itemId]) {
            URL.revokeObjectURL(imageUrls[itemId]);
        }

        const imageObjectUrl = URL.createObjectURL(file);
        setImageUrls(prev => ({
            ...prev,
            [itemId]: imageObjectUrl
        }));

        setList(prevList => prevList.map(p => {
            if (p.id === itemId) {
                return {
                    ...p,
                    editData: {
                        ...p.editData,
                        imageFile: file
                    }
                };
            }
            return p;
        }));
    };

    const saveChanges = async (id) => {
        const product = list.find(p => p.id === id);
        const editData = product.editData;
        
        try {
            const formData = new FormData();
            
            const productData = {
                id: id,
                name: editData.name,
                category: editData.category,
                price: Number(editData.price),
                description: editData.description || ""
            };
    
            formData.append("product", new Blob([JSON.stringify(productData)], { 
                type: "application/json" 
            }));
            formData.append("imageFile", editData.imageFile);
    
            await axios.put(
                `${backendUrl}/food/product/${id}`,
                formData,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data" 
                    }
                }
            );

            setList(prevList => prevList.map(item => 
                item.id === id 
                    ? { 
                        ...item,
                        name: editData.name,
                        category: editData.category,
                        price: Number(editData.price),
                        description: editData.description,
                        isEditing: false, 
                        editData: null
                    } 
                    : item
            ));
            
            alert('Changes saved successfully!');
        } catch (error) {
            console.error('Update failed:', error);
            alert(`Failed to save changes: ${error.response?.data?.message || error.message}`);
            if (imageUrls[id]) {
                URL.revokeObjectURL(imageUrls[id]);
                setImageUrls(prev => ({
                    ...prev,
                    [id]: prev[id]
                }));
            }
        }
    };

    return (
        <div className="list-container">
            <h1>Food Products</h1>
            <div className="list-header">
                <div className="header-item">Image</div>
                <div className="header-item">Name</div>
                <div className="header-item">Category</div>
                <div className="header-item">Price</div>
                <div className="header-item">Actions</div>
            </div>

            {list.map((item) => (
                <div key={item.id} className="list-item">
                    <div className="item-row">
                        <div className="item-cell">
                            <img 
                                src={imageUrls[item.id]} 
                                alt={item.name}
                                className="product-image"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        </div>
                        <div className="item-cell">{item.name}</div>
                        <div className="item-cell">{item.category}</div>
                        <div className="item-cell">${item.price}</div>
                        <div className="item-cell actions">
                            <button 
                                className={`button edit-btn ${item.isEditing ? 'active' : ''}`}
                                onClick={() => toggleEdit(item)}
                            >
                                {item.isEditing ? 'Close' : 'Edit'}
                            </button>
                            <button 
                                className={`button delete-btn ${deletingId === item.id ? 'deleting' : ''}`}
                                onClick={() => {
                                    if(window.confirm('Delete this item permanently?')) {
                                        deleteItem(item.id);
                                    }
                                }}
                                disabled={deletingId === item.id}
                            >
                                {deletingId === item.id ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>

                    {item.isEditing && (
                        <div className="edit-panel">
                            <div className="edit-section">
                                <label>Image:</label>
                                <div className="image-upload">
                                    <img 
                                        src={imageUrls[item.id]} 
                                        alt="Current" 
                                        className="thumbnail"
                                    />
                                    <input 
                                        type="file" 
                                        onChange={(e) => handleImageChange(e, item.id)}
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            <div className="edit-section">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={item.editData.name || ''}
                                    onChange={(e) => handleEditChange(e, item.id)}
                                />
                            </div>

                            <div className="edit-section">
                                <label>Category:</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={item.editData.category || ''}
                                    onChange={(e) => handleEditChange(e, item.id)}
                                />
                            </div>

                            <div className="edit-section">
                                <label>Price:</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={item.editData.price || ''}
                                    onChange={(e) => handleEditChange(e, item.id)}
                                    step="0.01"
                                />
                            </div>

                            <div className="edit-section">
                                <label>Description:</label>
                                <textarea
                                    name="description"
                                    value={item.editData.description || ''}
                                    onChange={(e) => handleEditChange(e, item.id)}
                                    rows="3"
                                />
                            </div>

                            <div className="edit-actions">
                                <button 
                                    className="button save-btn"
                                    onClick={() => saveChanges(item.id)}
                                >
                                    Save Changes
                                </button>
                                <button 
                                    className="button cancel-btn"
                                    onClick={() => toggleEdit(item)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
export default List;