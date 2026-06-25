'use client'

import api from '../libs/api'

export default function Test() {
    return (
        <div>
            Boton de pruebas
            <button onClick={() => {
                const testOp = async () => {
                    await api.get('/api/operations/test');
                }

                testOp()
            }}>Presioname</button>
        </div>
    )
}