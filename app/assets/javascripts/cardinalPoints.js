/*FUNCIONES PARA SABER QUE DIRECCION DEBO TOMAR DADO 2 PUNTOS CARDINALES*/
/*function eval_direction(comes_from, goes_to){
  var tell;

  if(comes_from == "Norte"){
    tell=where_to_turn_n(goes_to);
  }
  else if(comes_from == "Sur"){
    tell=where_to_turn_s(goes_to);
  }
  else if(comes_from == "Oriente"){
    tell=where_to_turn_e(goes_to);
  }
  else if(comes_from == "Occidente"){
    tell=where_to_turn_w(goes_to);
  }
  else if(comes_from == "Nororiente"){
    tell=where_to_turn_ne(goes_to);
  }
  else if(comes_from == "Noroccidente"){
    tell=where_to_turn_nw(goes_to);
  }
  else if(comes_from == "Suroriente"){
    tell=where_to_turn_se(goes_to);
  }
  else if(comes_from == "Suroccidente"){
    tell=where_to_turn_sw(goes_to);
  }
  return tell;
}

//NORTE
function where_to_turn_n(goes_to){
  var turn;

  if(goes_to=="Oriente"){
    turn = "a la derecha";
  }
  else if(goes_to=="Noroccidente" || goes_to=="Suroccidente"){
    turn = "ligeramente a la izquierda en dirección " + goes_to;
  }
  else if(goes_to=="Nororiente" || goes_to=="Suroriente"){
    turn = "ligeramente a la derecha en dirección " + goes_to;
  }
  else if(goes_to=="Occidente"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Sur"){
    turn = "en giro en U";
  }
  return turn;
}

//OCCIDENTE
function where_to_turn_w(goes_to){
  var turn;

  if(goes_to=="Norte"){
    turn = "a la derecha";
  }
  else if(goes_to=="Noroccidente" || goes_to=="Nororiente"){
    turn = "ligeramente a la derecha en dirección " + goes_to;
  }
  else if(goes_to=="Sur"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Suroccidente" || goes_to=="Suroriente"){
    turn = "ligeramente a la izquierda en dirección " + goes_to;
  }
  else if(goes_to=="Oriente"){
    turn = "en giro en U";
  }
return turn;
}

//ORIENTE
function where_to_turn_e(goes_to){
  var turn;

  if(goes_to=="Norte"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Noroccidente" || goes_to == "Nororiente"){
    turn = "ligeramente a la izquierda en dirección " + goes_to;
  }
  else if(goes_to=="Sur"){
    turn = "a la derecha";
  }
  else if(goes_to=="Suroccidente" || goes_to=="Suroriente"){
    turn = "ligeramente a la derecha en dirección " + goes_to;
  }
  else if(goes_to=="Occidente"){
    turn = "en giro en U";
  }
  return turn;
}

//SUR
function where_to_turn_s(goes_to){
  var turn;

  if(goes_to=="Oriente"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Noroccidente" || goes_to=="Suroccidente"){
    turn = "ligeramente a la derecha en dirección " + goes_to;
  }
  else if(goes_to=="Nororiente" || goes_to=="Suroriente"){
    turn = "ligeramente a la izquierda en dirección " + goes_to;
  }
  else if(goes_to=="Occidente"){
    turn = "a la derecha";
  }
  else if(goes_to=="Norte"){
    turn = "en giro en U";
  }
  return turn;
}

//SUROCCIDENTE
function where_to_turn_sw(goes_to){
  var turn;

  if(goes_to=="Norte"){
    turn = "a la derecha";
  }
  else if(goes_to=="Noroccidente" || goes_to=="Occidente"){
    turn = "ligeramente a la derecha en dirección " + goes_to;
  }
  else if(goes_to=="Sur" || goes_to=="Suroriente"){
    turn = "ligeramente a la izquierda en dirección " + goes_to;
  }
  else if(goes_to=="Oriente"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Nororiente"){
    turn = "en giro en U";
  }
  return turn;
}

//SURORIENTE
function where_to_turn_se(goes_to){
  var turn;
  if(goes_to=="Norte"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Nororiente" || goes_to=="Oriente"){
    turn = "ligeramente a la izquierda en dirección " + goes_to;
  }
  else if(goes_to=="Sur" || goes_to=="Suroccidente"){
    turn = "ligeramente a la derecha en dirección " + goes_to;
  }
  else if(goes_to=="Occidente"){
    turn = "a la derecha";
  }
  else if(goes_to=="Noroccidente"){
    turn = "en giro en U";
  }
  return turn;
}

//NOROCCIDENTE
function where_to_turn_nw(goes_to){
  var turn;

  if(goes_to=="Oriente"){
    turn = "a la derecha";
  }
  else if(goes_to=="Occidente" || goes_to=="Suroccidente"){
    turn = "ligeramente a la izquierda en dirección " + goes_to;
  }
  else if(goes_to=="Norte" || goes_to=="Nororiente"){
    turn = "ligeramente a la derecha en dirección " + goes_to;
  }
  else if(goes_to=="Sur"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Suroriente"){
    turn = "en giro en U";
  }
  return turn;
}

//NORORIENTE
function where_to_turn_ne(goes_to){
  var turn;

  if(goes_to=="Sur"){
    turn = "a la derecha";
  }
  else if(goes_to=="Norte" || goes_to=="Noroccidente"){
    turn = "ligeramente a la izquierda en dirección " + goes_to;
  }
  else if(goes_to=="Oriente" || goes_to=="Suroriente"){
    turn = "ligeramente a la derecha en dirección " + goes_to;
  }
  else if(goes_to=="Occidente"){
    turn = "a la izquierda";
  }
  else if(goes_to=="Suroccidente"){
    turn = "en giro en U";
  }
  return turn;
}*/
