import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faIdCard,           // Para tarjetas
    faAddressCard,      // Alternativa para tarjetas
    faCircleQuestion,   // Para el icono por defecto
    faChevronDown,      // Para dropdowns
    faBars,             // Para menú móvil
    faTimes             // Para cerrar menú móvil
} from '@fortawesome/free-solid-svg-icons';

import {
    faCircleQuestion as farCircleQuestion
} from '@fortawesome/free-regular-svg-icons';

// Agregar iconos a la librería
library.add(
    faIdCard,
    faAddressCard,
    faCircleQuestion,
    faChevronDown,
    faBars,
    faTimes,
    farCircleQuestion
);
