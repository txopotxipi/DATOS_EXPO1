<?php
function obtenerEstructura() {
    $datos = file_get_contents('datos.json');
    $estructura = json_decode($datos, true);
    $especialidades = $estructura['especialidades'];
    return json_encode($especialidades);
}

function actualizarDatos($elemento, $nuevoValor) {
    $datos = file_get_contents('datos.json');
    $estructura = json_decode($datos, true);
    actualizarValorEnEstructura($estructura['especialidades'], $elemento, $nuevoValor);
    $datosActualizados = json_encode($estructura, JSON_PRETTY_PRINT);
    file_put_contents('datos.json', $datosActualizados);
}

function actualizarValorEnEstructura(&$estructura, $elemento, $nuevoValor) {
    foreach ($estructura as &$item) {
        if ($item['nombre'] === $elemento) {
            $item['valor'] = $nuevoValor;
            return;
        }
        if (isset($item['elementos'])) {
            actualizarValorEnEstructura($item['elementos'], $elemento, $nuevoValor);
        }
        if (isset($item['componentes'])) {
            actualizarValorEnEstructura($item['componentes'], $elemento, $nuevoValor);
        }
    }
}

function crearElemento($rutaPadre, $nuevoElemento, $nuevoValor) {
    $datos = file_get_contents('datos.json');
    $estructura = json_decode($datos, true);
    $ruta = explode('/', $rutaPadre);
    $elementoPadre = buscarElementoPadre($estructura['especialidades'], $ruta);

    if ($elementoPadre !== null) {
        if (!isset($elementoPadre['elementos'])) {
            $elementoPadre['elementos'] = [];
        }
        $elementoPadre['elementos'][] = [
            'nombre' => $nuevoElemento,
            'valor' => $nuevoValor,
            'componentes' => []
        ];
        $datosActualizados = json_encode($estructura, JSON_PRETTY_PRINT);
        file_put_contents('datos.json', $datosActualizados);
    } else {
        echo "No se encontró el elemento padre";
    }
}

function &buscarElementoPadre(&$estructura, $ruta) {
    if (empty($ruta)) {
        return $estructura;
    }

    $elementoActual = array_shift($ruta);
    foreach ($estructura as &$item) {
        if ($item['nombre'] === $elementoActual) {
            if (empty($ruta)) {
                return $item;
            } else {
                if (isset($item['componentes'])) {
                    $resultado = &buscarElementoPadre($item['componentes'], $ruta);
                    if ($resultado !== null) {
                        return $resultado;
                    }
                }
                if (isset($item['elementos'])) {
                    $resultado = &buscarElementoPadre($item['elementos'], $ruta);
                    if ($resultado !== null) {
                        return $resultado;
                    }
                }
            }
        }
    }
    $null = null;
    return $null;
}

if (isset($_GET['action']) && $_GET['action'] === 'obtenerEstructura') {
    echo obtenerEstructura();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $accion = $_POST['accion'];
    if ($accion === 'actualizar') {
        $elemento = $_POST['elemento'];
        $nuevoValor = $_POST['nuevoValor'];
        actualizarDatos($elemento, $nuevoValor);
    } elseif ($accion === 'crear') {
        $rutaPadre = $_POST['rutaPadre'];
        $nuevoElemento = $_POST['nuevoElemento'];
        $nuevoValor = $_POST['nuevoValor'];
        crearElemento($rutaPadre, $nuevoElemento, $nuevoValor);
    }
}
?>