<?php

include('conexao.php');  //arquivo de conexão
include('functions.php'); //arquivo de funções
header('Content-type: application/json; charset: utf-8');


//Default: retorna TODOS os eventos a partir da data atual
$sql0 = "SELECT * FROM events NATURAL JOIN places";
$sql = " where (timeStart >='";

$date = date('Y-m-d') . " 00:00:00";

//Se a pesquisa é por uma data inicial diferente da atual
if(isset($_GET['ts'])){

	$date = $_GET['ts'];
}

//Insere a busca por data inicial
$sql .= $date . "')";

//Se algum parametro extra é passado via GET
if(!empty($_GET)){
	//Se a busca inclui uma data limite de pesquisa
	if(isset($_GET['te'])){

		$sql .= "and (timeStart <='".$_GET['te']."')";

	}


	//Se a pesquisa é por tipo
	if(isset($_GET['wo']) || isset($_GET['pa'])){
		if(isset($_GET['wo']) && isset($_GET['pa'])){
			$sql .= " and (type='Workshop' or type='Palestra')";
		}
		else{
			if (isset($_GET['wo'])){
				$sql .= " and (type='Workshop')";
			}
			else{
				$sql .= " and (type='Palestra')";
			}
		}
	}

	//Se a pesquisa é por palavra-chave (busca no título e na descrição)
	if(isset($_GET['txt'])){
		$search = str_replace(" ","%",$_GET['txt'] );
		$sql .= " and (title like '%".$search."%' or description like '%".$search."%')";

	}

	//Se a pesquisa é por local 
	if(isset($_GET['p'])){
		$search = str_replace(" ","%",$_GET['p'] );
		$sql .= " and (placeName like '%".$search."%')";

	}

	//Se a pesquisa é por palestrante 
	if(isset($_GET['l'])){
		//Amplia o escopo de pesquisa (mais custoso)
		$sql0 = "SELECT * FROM events NATURAL JOIN places NATURAL JOIN lecturers";

		$search = str_replace(" ","%",$_GET['l'] );
		$sql .= " and (lecturerName like '%".$search."%')";

	}
	
	
}

//Encerra a string da SQL
$sql .= ";";
$sql = $sql0 . $sql;

//echo $sql;

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
