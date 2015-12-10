<?php
include('conexao.php');  //arquivo de conexão
include('functions.php'); //arquivo de funções
header('Content-type: application/json; charset: utf-8');

$sql = "SELECT * FROM places;";

//Executa a consulta SQL e imprime em JSON
$res = mysql_query($sql, $conexao);
$num = mysql_num_rows($res);  //numero de resultados retornados

//loop para popular o array com os resultados encontrados
for ($i = 0; $i < $num; $i++) {
	$dados[$i] = mysql_fetch_assoc($res);
}

utf8_encode_deep($dados);
echo json_encode($dados);

?>
