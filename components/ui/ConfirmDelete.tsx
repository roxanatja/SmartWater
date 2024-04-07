import * as AlertDialog from "@radix-ui/react-alert-dialog";

interface ConfirmDeleteProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDelete({ isOpen, onConfirm, onCancel }: ConfirmDeleteProps) {
  return (
    <AlertDialog.Root open={isOpen}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
          <AlertDialog.Title className="text-xl font-bold mb-4">
            Confirmar eliminación
          </AlertDialog.Title>
          <AlertDialog.Description className="text-gray-600 mb-6">
            ¿Estás seguro de que deseas eliminar este cliente? Esta acción no se
            puede deshacer.
          </AlertDialog.Description>
          <div className="flex justify-end space-x-4">
            <AlertDialog.Cancel asChild>
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700"
              >
                Cancelar
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded bg-red-500 text-white"
              >
                Eliminar
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export default ConfirmDelete;
