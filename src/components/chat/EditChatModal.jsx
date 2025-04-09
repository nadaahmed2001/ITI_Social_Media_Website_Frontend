import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, TextField } from "@mui/material";

const EditChatModal = ({ open, onClose, onSave, oldContent }) => {
    const [newContent, setNewContent] = useState(oldContent || "");

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Message</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    fullWidth
                    multiline
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={() => onSave(newContent)}
                    disabled={!newContent.trim()}
                    variant="contained"
                    color="primary"
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditChatModal;
