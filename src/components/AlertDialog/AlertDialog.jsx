import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Slide,
  IconButton,
} from "@mui/material";
import { Lock } from "@mui/icons-material";  // Import the Lock icon

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function AlertDialogSlide({ open, onClose }) {
  const handleClose = () => {
    onClose(false); // Close the dialog when the close button or OK is clicked
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose} // Optional: close when clicking outside
      aria-describedby="alert-dialog-slide-description"
      role="alertdialog"
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#d32f2f",
          color: "#ffffff",
          textAlign: "center",
          borderRadius: "10px",
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "center" }}>
        {/* Lock icon + Close icon */}
        <IconButton onClick={handleClose} aria-label="close" sx={{ marginRight: 1 }}>
          <Lock sx={{ fontSize: 30, color: "#ffffff" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-slide-description"
          sx={{ color: "#ffffff", fontSize: "18px", fontWeight: "bold" }}
        >
          Access Denied!<br/>
          Please log in to continue.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={handleClose} // Closes the alert when clicked
          sx={{
            backgroundColor: "#b71c1c",
            color: "#ffffff",
            padding: "6px 20px",
            borderRadius: "5px",
            "&:hover": {
              backgroundColor: "#9a0007",
            },
          }}
        >
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
}
