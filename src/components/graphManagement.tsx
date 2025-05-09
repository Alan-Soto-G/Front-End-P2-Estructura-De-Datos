import React from 'react';
import { useState } from 'react';

interface GraphManagementProps {
    visible: boolean;
    title: string;
    node: boolean;
}

const GraphManagement: React.FC<GraphManagementProps> = ({visible, title, node}) => {
    if(!visible) return null; // If not visible, return null
    console.log(localStorage.getItem("userMap"));
    return (
        <section className='management-card'>
            <h1>{title}</h1>
            <form className="flex flex-col gap-3 items-center w-full">
                {node ? (
                    <>
                    </>

                ) : (
                    <div>
                        <select name="selectFromPoint" id="fromPoint" className="bg-gray-100 h-10 w-40 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500">
                            <option value="" disabled hidden>Punto de partida</option>
                            <option value="d">Node 1</option>
                            
                        </select>
                    </div>
                )}
                <button type='submit' className="bg-blue-500 text-white px-4 py-2 rounded">Hola</button>
            </form>
        </section>
    );
};
export default GraphManagement;