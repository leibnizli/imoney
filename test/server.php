<?php
    $name = isset($_POST['name'])? $_POST['name'] : '';
    $age = isset($_POST['age'])? $_POST['age'] : '';
    $response = array();
    $response['name'] = $name;
    $response['age'] = $age;
    echo json_encode($response);
?>