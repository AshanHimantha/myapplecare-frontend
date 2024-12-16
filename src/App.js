import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/hey');
                console.log('Response:', response);
                setProducts(response);
                setLoading(false);
                
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Test Products</h1>
            <ul>
                {products}
            </ul>
        </div>
    );
};

export default App;
