import FormDialog from "../../../shared/components/FormDialog";

function MessageModal(props){
    const { open, theme, onClose, onSuccess, price } = props;
    return (
        <FormDialog
            open={open}
            content={
                <div>Success</div>
            }
            onClose = {onClose}
        />
    )
}
export default MessageModal;