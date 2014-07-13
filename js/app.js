$(function(){
	var cidades=[];
	var votos=[];
	var segTurno=[];
	$.ajax({
			url : "js/cidades.csv", /*Lê o CSV das Cidades*/
			success : function(result){
				cidades = $.csv.toObjects(result);
				onReady();
			}
		});
	
	function onReady(){ /*Cria a lista de cidades*/
		var listaCidades="";

		for (i=0; i < cidades.length; i++){
			listaCidades = listaCidades + "<li class='ui-first-child'><a href='#candidatos' class='ui-btn ui-btn-icon-right ui-icon-carat-r'><span class='idCidade'>"+
											cidades[i].ID+"  </span>"+
														cidades[i].CIDADE.toLowerCase()+"</li>";		
		}
		$("#ulCidade").html(listaCidades);
		
		$('#ulCidade').on("click","li", function(){ /*Ouve o click na cidade da lista e chama o CSV correspondente*/
		var word = $(this).first().text();
		
		word = word.split("  ");
		$("#hdCidade").html("<span style='text-transform:capitalize;'>"+word[1]+"</span>");
			$.ajax({
				url : "js/csv/file_0"+word[0]+".csv",
				success : function(result){
					votos = $.csv.toArrays(result);
					$.ajax({ /*Chama o CSV do segundo Turno*/
						url : "js/segundo_turno.csv",
						success : function(result){
							segTurno = $.csv.toObjects(result);
							onReadyVotos();
						}
						
					}); 
				}
			});
		});
	}
	
		function onReadyVotos(){ /*[0] - CIDADE,[1] - CARGO,[2] - NOME_URNA,[3] - NOME,[4] - STATUS,[5] - PARTIDO,[6] - COLIGAÇÃO,[7] - VOTOS*/

			var listaCandidados="";
			var pVotos=[];
				for (i=0; i < votos.length; i++){
				pVotos=votosSegTurno(i);
				/*Cria lista de candidatos*/
				listaCandidados = listaCandidados + "<li class='ui-first-child'><a href='#perfil' class='ui-btn ui-btn-icon-right ui-icon-carat-r' style='padding:10px 10px'><div class='divNomeCargo'><div class='nomeCandidato'>"
														+votos[i][2].toLowerCase()+"   </div><div class='cargoCandidato'> Cargo: "+votos[i][1].toLowerCase()+"</div></div><div class='votoCandidato'><div class='votosCandidato'>1º Turno: "
														+votos[i][7]+"</div><div class='votosCandidato'>"+(votos[i][4]=='2º TURNO' ? votos[i][4].toLowerCase()+": "+pVotos[0]: votos[i][4].toLowerCase())+"</div></div></a></li>";		
			}
			$("#ulCandidatos").html(listaCandidados); /*Atualiza lista*/
			
			$('#ulCandidatos').on("click","li", function(){
			var word = $(this).first().text();
					word = word.split("  ");
					var tabelaPerfil="";
					for (i=0; i < votos.length; i++){
						if (word[0].toUpperCase()==votos[i][2]){
							tabelaPerfil = tabelaPerfil + "<tr><th>Cargo: </th><td>"+votos[i][1].toLowerCase()+"</td></tr><tr><th>Partido: </th><td>"+votos[i][5]+"</td></tr><tr><th>Coligação: </th><td>"
															+votos[i][6].toLowerCase()+"</td></tr><tr><th>Situação: </th><td>"+(votos[i][4]=='2º TURNO' ? votosSegTurno(i)[1].toLowerCase()+" no 2º Turno":votos[i][4].toLowerCase())+"</td></tr>"
							$('#nome_urna').html(votos[i][2].toLowerCase());
							$('#nome').html(votos[i][3].toLowerCase());							
							$('#tbPerfil').html(tabelaPerfil);
							break;
						}
					}
			});
			
			$("#pesquisar").click(function(){
				var word = $('#nome').first().text();
				word = word.replace(/\ /g,"+");
				word = word.replace(/[áàâã]/g,'a').replace(/[éèê]/g,'e').replace(/[óòôõ]/g,'o').replace(/[úùû]/g,'u');
				console.log(word);
				$('#iframe').attr('src', "https://www.google.com.br/#q="+word+"&output=embed");
				$.mobile.changePage( "#search", { transition: "flip"});
			});
			
			
			function votosSegTurno(index){ /*Expõe os votos do segundo turno*/
				var nVotos=[];
				for(j=0; j< segTurno.length; j++){
					if (votos[index][0]==segTurno[j].CIDADE){
						if (votos[index][2]==segTurno[j].NOME_URNA){
							nVotos[0]=segTurno[j].VOTOS;
							nVotos[1]=segTurno[j].STATUS;
							break;
						} else {
							nVotos[0]=segTurno[j].VOTOS;
							nVotos[1]=segTurno[j].STATUS;
						}
					}
				}
				return nVotos;
			}
			
			
		}
		
		
	
	
});