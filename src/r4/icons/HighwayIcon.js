import React from 'react';
import { SvgIcon } from '@mui/material';

export default function HighwayIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M20 18V5H18V18V20H20V18Z" fill="#012A2D" />
            <path d="M20 4H18V13H20V4Z" fill="#012A2D" />
            <path d="M6 4H4V20H6V4Z" fill="#012A2D" />
            <path d="M13 4H11V8H13V4Z" fill="#012A2D" />
            <path d="M13 10H11V14H13V10Z" fill="#012A2D" />
            <path d="M13 16H11V20H13V16Z" fill="#012A2D" />
        </SvgIcon>
    );
}