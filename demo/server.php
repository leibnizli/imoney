<?php
    $name = isset($_POST['name'])? $_POST['name'] : '';
    $response = array();
    $response['name'] = $name;
    echo json_encode($response);
?>