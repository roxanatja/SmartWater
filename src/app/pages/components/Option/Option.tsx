import { FC } from "react";
import "./Option.css";

interface OptionsMenuProps {
  visible: boolean;
  editar?: boolean;
  eliminar?: boolean;
  editAction?: () => void;
  deleteAction?: () => void;
}

const Option: FC<OptionsMenuProps> = ({
  visible,
  editar,
  editAction,
  eliminar,
  deleteAction,
}) => {
  return (
    <>
      {visible && (
        <div className="options-menu right-10">
          {editar && (
            <div onClick={editAction} className="option-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="21"
                viewBox="0 0 22 21"
                fill="none"
              >
                <path
                  d="M2.75 20.7633C2.2 20.7633 1.729 20.5676 1.337 20.1763C0.945002 19.785 0.749335 19.3139 0.750002 18.7633V4.76328C0.750002 4.21328 0.946002 3.74228 1.338 3.35028C1.73 2.95828 2.20067 2.76261 2.75 2.76328H11.675L9.675 4.76328H2.75V18.7633H16.75V11.8133L18.75 9.81328V18.7633C18.75 19.3133 18.554 19.7843 18.162 20.1763C17.77 20.5683 17.2993 20.764 16.75 20.7633H2.75ZM13.925 3.33828L15.35 4.73828L8.75 11.3383V12.7633H10.15L16.775 6.13828L18.2 7.53828L11 14.7633H6.75V10.5133L13.925 3.33828ZM18.2 7.53828L13.925 3.33828L16.425 0.838281C16.825 0.438281 17.3043 0.238281 17.863 0.238281C18.4217 0.238281 18.8923 0.438281 19.275 0.838281L20.675 2.26328C21.0583 2.64661 21.25 3.11328 21.25 3.66328C21.25 4.21328 21.0583 4.67995 20.675 5.06328L18.2 7.53828Z"
                  fill="black"
                />
              </svg>
              <span>Editar</span>
            </div>
          )}
          {eliminar && (
            <div onClick={deleteAction} className="option-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="19"
                viewBox="0 0 14 19"
                fill="none"
              >
                <path
                  d="M14 1.5H10.5L9.5 0.5H4.5L3.5 1.5H0V3.5H14M1 16.5C1 17.0304 1.21071 17.5391 1.58579 17.9142C1.96086 18.2893 2.46957 18.5 3 18.5H11C11.5304 18.5 12.0391 18.2893 12.4142 17.9142C12.7893 17.5391 13 17.0304 13 16.5V4.5H1V16.5Z"
                  fill="black"
                />
              </svg>
              <span>Eliminar</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export { Option };
