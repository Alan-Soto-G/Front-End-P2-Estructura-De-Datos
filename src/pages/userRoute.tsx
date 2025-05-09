import React from 'react';
import { useState } from 'react';
import Route from '../components/route';
import GraphManagement from '../components/graphManagement';

const UserRoute: React.FC = () => {

    return (
        <>
        <GraphManagement visible={true} title="Graph Management" node={false}/>
        </>
    );
};
export default UserRoute;