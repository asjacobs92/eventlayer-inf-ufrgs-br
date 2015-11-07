<?php
include('conexao.php');  //arquivo criado acima
header('Content-type: application/json');
$sql = "SELECT * FROM events";  //busco todos os estados e ordeno pela sigla
$res = mysql_query($sql, $conexao);
$num = mysql_num_rows($res);  //numero de estados encontrados

//loop para popular o array com todos os estados
for ($i = 0; $i < $num; $i++) {
  $dados[$i] = mysql_fetch_assoc($res);
}

echo json_encode($dados);

//echo json_encode($num);

?>
