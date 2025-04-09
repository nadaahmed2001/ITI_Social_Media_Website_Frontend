import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";

const ConfirmDeleteModal = ({ open, onClose, onConfirm }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Delete Message</DialogTitle>
        <DialogContent>
            <Typography>Are you sure you want to delete this message?</Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onConfirm} variant="contained" color="error">
                Delete
            </Button>
        </DialogActions>
    </Dialog>
);

export default ConfirmDeleteModal;
