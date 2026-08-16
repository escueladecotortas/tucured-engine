const API_URL = '/api/payments';

export const createPreference = async (title, price) => {
    try {
        const response = await fetch(`${API_URL}/create_preference`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, price }),
        });

        if (!response.ok) {
            throw new Error('Error en la red');
        }

        const data = await response.json();
        return data.init_point; // URL de Mercado Pago
    } catch (error) {
        console.error('Error creating payment preference:', error);
        return null;
    }
};
