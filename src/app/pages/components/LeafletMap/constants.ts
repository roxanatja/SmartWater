export const getMarkerHtml = (color: string) => {
  return `<svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="30"
                viewBox="0 0 31 47"
                fill="${color}"
              >
                <path d="M31 15.3918C31 23.8925 23.1159 33.807 15.5 47C6.78557 33.807 0 23.8925 0 15.3918C0 6.89115 6.93959 0 15.5 0C24.0604 0 31 6.89115 31 15.3918Z" />
              </svg>`
}

export const markerStyles = {
  renewClient: { backgroundColor: '#FF5C00' },
  inProgress: { backgroundColor: '#DD0000' },
  attended: { backgroundColor: '#1FAF38' },
  default: { backgroundColor: '#960090' }
};