// // components/MessageActions.jsx
// import React from "react";
// import { Button, Menu, MenuItem, IconButton } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";

// const MessageActions = ({ onEdit, onDelete }) => {
//     const [anchorEl, setAnchorEl] = React.useState(null);
//     const open = Boolean(anchorEl);

//     const handleClick = (event) => {
//         setAnchorEl(event.currentTarget);
//     };

//     const handleClose = () => {
//         setAnchorEl(null);
//     };

//     return (
//         <>
//             <IconButton
//                 aria-controls="message-actions-menu"
//                 aria-haspopup="true"
//                 onClick={handleClick}
//                 size="small"
//                 sx={{ color: "#facc15" }}
//             >
//                 <MoreVertIcon fontSize="small" />
//             </IconButton>
//             <Menu
//                 id="message-actions-menu"
//                 anchorEl={anchorEl}
//                 open={open}
//                 onClose={handleClose}
//                 anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//                 transformOrigin={{ vertical: "top", horizontal: "right" }}
//             >
//                 <MenuItem
//                     onClick={() => {
//                         onEdit();
//                         handleClose();
//                     }}
//                 >
//                     Edit
//                 </MenuItem>
//                 <MenuItem
//                     onClick={() => {
//                         onDelete();
//                         handleClose();
//                     }}
//                 >
//                     Delete
//                 </MenuItem>
//             </Menu>
//         </>
//     );
// };

// export default MessageActions;
