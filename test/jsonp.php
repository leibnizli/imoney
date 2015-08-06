<?php
    $name = isset($_GET['name'])? $_GET['name'] : '';
    $age = isset($_GET['age'])? $_GET['age'] : '';
    $response = array();
    $response['name'] = $name;
    $response['age'] = $age;
    $json = json_encode($response);
    echo isset($_GET['callback'])
        ? "{$_GET['callback']}($json)"
        : $json;
?>