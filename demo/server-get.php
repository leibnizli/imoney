<?php
    $name = isset($_GET['name'])? $_GET['name'] : '';
    $age = isset($_GET['age'])? $_GET['age'] : '';
    $response = array();
    $response['name'] = $name;
    $response['age'] = $age;
    echo json_encode($response);
?>