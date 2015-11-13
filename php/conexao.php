<?php
$db_banco ="eventlayer";
$db_user = "eventlayer";
$db_pass = "q1w2e3r4t5#";
$host = 'db.inf.ufrgs.br';
 
$conexao = @mysql_connect($host,$db_user,$db_pass); //crio a conexao
 
//verifico se conseguiu conectar
if (!($conexao)){
    print("<script language=JavaScript>
          alert(\"Não foi possível conectar ao Banco de Dados.\");
          </script>");
	echo $conexao;
    exit;
}

 
//selecio o banco de dados
$db = mysql_select_db($db_banco,$conexao) or
    die("<script language=JavaScript>alert(\"Tabela inexistente!\");</script>"); 
?>
