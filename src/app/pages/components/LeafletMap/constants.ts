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

export const getDistribuidorMarkerHtml = (color: string) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 39 38" fill="none">
            <path d="M17.2319 2.09792C24 19.5978 7.23193 22.5979 0.231928 16.0979C-0.968072 23.698 2.7324 29.0979 5.73193 29.0979H23.7319C26.5 7.59778 21 1.09766 17.2319 2.09792Z" fill="${color}" />
            <path d="M27 17.5976V8.59756C37.4 7.79756 38.6667 14.5976 38 18.0976L27 17.5976Z" fill="${color}" />
            <path d="M27 21.068V29.5366C37.2632 30.2893 38.6579 24.891 38 21.5977L27 21.068Z" fill="${color}" />
            <path d="M32 32.0977H24C24 33.931 24.9 37.4977 28.5 37.0977C32.1 36.6977 32.3333 33.5977 32 32.0977Z" fill="${color}" />
            <path d="M14 32.5977H6C6 34.431 6.9 37.9977 10.5 37.5977C14.1 37.1977 14.3333 34.0977 14 32.5977Z" fill="${color}" />
            <path d="M12.5 1.11658C13.7569 1.84229 14.8025 2.88368 15.5332 4.13766C16.2639 5.39164 16.6545 6.81472 16.6662 8.26603C16.6779 9.71733 16.3104 11.1465 15.6 12.4122C14.8896 13.6778 13.861 14.7359 12.616 15.4818C11.371 16.2278 9.95281 16.6356 8.50175 16.665C7.05069 16.6943 5.61713 16.3442 4.34296 15.6493C3.0688 14.9543 1.99823 13.9387 1.23722 12.7028C0.476219 11.467 0.0511744 10.0538 0.00416676 8.60324L0 8.33324L0.00416676 8.06324C0.050836 6.62407 0.469623 5.22154 1.2197 3.9924C1.96978 2.76326 3.02554 1.74945 4.28408 1.04981C5.54261 0.350171 6.96096 -0.0114257 8.40084 0.000275205C9.84072 0.0119761 11.253 0.396575 12.5 1.11658ZM8.33333 3.33324C8.12922 3.33327 7.93222 3.40821 7.77969 3.54384C7.62716 3.67947 7.52971 3.86637 7.50583 4.06908L7.5 4.16658V8.33324L7.5075 8.44241C7.5265 8.58699 7.58311 8.72406 7.67167 8.83991L7.74417 8.92324L10.2442 11.4232L10.3225 11.4916C10.4686 11.605 10.6484 11.6665 10.8333 11.6665C11.0183 11.6665 11.198 11.605 11.3442 11.4916L11.4225 11.4224L11.4917 11.3441C11.6051 11.1979 11.6666 11.0182 11.6666 10.8332C11.6666 10.6483 11.6051 10.4686 11.4917 10.3224L11.4225 10.2441L9.16667 7.98741V4.16658L9.16083 4.06908C9.13695 3.86637 9.03951 3.67947 8.88698 3.54384C8.73445 3.40821 8.53745 3.33327 8.33333 3.33324Z" fill="${color}" />
          </svg>`
}

export type ClientStatus = keyof typeof markerStyles

export const markerStyles: Record<string, { backgroundColor: string; text: string; icon: string }> = {
  renewClient: { backgroundColor: '#FF5C00', text: "Clientes por visitar", icon: "/map-icon-renewClient.svg" },
  inProgress: { backgroundColor: '#DD0000', text: "Pedidos en curso", icon: "/map-icon-inProgress.svg" },
  attended: { backgroundColor: '#1FAF38', text: "Pedidos atendidos", icon: "/map-icon-attended.svg" },
  default: { backgroundColor: '#960090', text: "Resto de clientes", icon: "/map-icon-default.svg" }
};