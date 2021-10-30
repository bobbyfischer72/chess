    let history=[]
    let turn= "white"

    function displayHistory() {
        let letters={king:"K", queen:"Q", rook:"R", bishop:"B", knight:"N", pawn:""}
        let rows= $("#gamelog tr").length;
        for(let i=0; i<history.length; i++) {
            let row=Math.floor(i/2)+1, col=i%2;
            if(row+1>=rows){
                $("#gamelog tbody").append("<tr><td class='lognumber'></td><td class='wback'></td><td class='bback'></td></tr>")
                rows++
            }
            let $td=$("#gamelog tr:nth-child("+(row+2)+")>td:nth-child("+(col+2)+")")
            let item= history[i]
            let string=""
            if (item.castling){
                string=item.castling
            }
            else {
                string= letters[item.type]+" "+(item.capture&&item.type!="pawn"?"x":"")+String.fromCharCode(96+item.column)+" "+(9-item.row);
                if (item.type=="pawn"&&item.capture) {
                    string=String.fromCharCode(96+item.srcCol)+"x"+string
                }
            }
            if (item.checkmate) {
                string+="#"
            }

            else if (item.check) {
                string+="+"
            }

            $td.html(string)

        }
            for(let i=0; i<history.length/2;i++) {
                let $td=$("#gamelog tr:nth-child("+(i+3)+")>td:nth-child(1)")
                    $td.html(i+1)
            }
    }

    function checkLegal(pieceType, pieceColor, pieceNumber, srcRow, srcCol, destRow, destCol, checkingCheck, checkingCheckmate) {
        let print=(pieceType=="queen"&&destRow==2)
            if (print)
            console.log("checking legal "+pieceType+" "+pieceColor+" "+pieceNumber+" "+srcRow+" "+srcCol+" "+destRow+" "+destCol+" "+checkingCheck)
        srcRow=parseInt(srcRow)
        srcCol=parseInt(srcCol)
        destRow=parseInt(destRow)
        destCol=parseInt(destCol)
        if (pieceColor!=turn && !checkingCheck && !checkingCheckmate)
            return false;
        if(srcRow==destRow && srcCol==destCol)
            return false;

        let legal=false;

        let newKingpos=getPosition("king",pieceColor, 1)
        let dir=pieceColor=="black"?1:-1;
        let firstRow= pieceColor=="black"?2:7;
        let oppColor=pieceColor=="black"?"white":"black";
        let destSquare= $(".chess-square[row="+destRow+"][column="+destCol+"]");
        let samePiece=destSquare.find("img[color=" + pieceColor + "]");
        if(samePiece.length>0)
            return false;
        let oppPiece=destSquare.find("img[color=" + oppColor + "]")

        let sourceSquare= $(".chess-square[row="+srcRow+"][column="+srcCol+"]");
        let piece=sourceSquare.find("img[color=" + pieceColor + "]");

        let hDir=Math.sign(destCol-srcCol), vDir=Math.sign(destRow-srcRow)

        let dRow = Math.abs(destRow-srcRow), dCol= Math.abs(destCol-srcCol)

        if(pieceType=="pawn") {
        let distance=(srcRow==firstRow)?2:1;
            if (destRow==srcRow+dir && Math.abs(srcCol-destCol)==1 && oppPiece.length>0) {
                //oppPiece.detach().appendTo(".sidebar")
                legal=true;
            }
            else legal=(srcCol==destCol && (destRow==srcRow+dir || destRow==srcRow+distance*dir) && oppPiece.length==0)
            if (legal&&destRow==(pieceColor=="white"?1:8)) {
                piece.attr("type","queen")
                piece.attr("src","/welcome/static/images/chesspieces/"+pieceColor+"queen.png")
            }
            }
        else if(pieceType=="knight") {
            legal=(dCol==2 && dRow==1) || (dCol==1 && dRow==2);
        }
        else if(pieceType=="bishop") {
            legal=dCol==Math.abs(destRow-srcRow);

        }
        else if(pieceType=="rook") {
            legal=(destRow==srcRow) || (destCol==srcCol);
        }

        else if(pieceType=="queen") {
            legal=dCol==Math.abs(destRow-srcRow) || (destRow==srcRow) || (destCol==srcCol);
        }
        else if(pieceType=="king") {
            var castling= (dCol==2 && dRow==0 && numMoves(pieceType, pieceColor, pieceNumber)==0)
            if (castling) {
                let rookNumber= destCol==3?1:2;
                let rook= getPiece("rook",pieceColor, rookNumber)
                let firstRow=pieceColor=="black"?1:8
                let clear=destCol==7 || (destCol==3 && !isOccupied(firstRow,2))
                let rookcol=destCol==7?6:4;
                if (numMoves("rook", pieceColor, rookNumber)==0 && clear) {
                    rook.detach().appendTo(getSpace(firstRow, rookcol))
                    legal=true
                }
            }
            else legal=(Math.abs(destRow-srcRow)<=1 && Math.abs(destCol-srcCol)<=1)
                newKingpos.row=destRow
                newKingpos.column=destCol
        }
        if (legal && (pieceType=="bishop" || pieceType=="rook" || pieceType=="queen" || (pieceType=="king" && !castling))) {
            for(let c=srcCol+hDir, r=srcRow+vDir; c!=destCol || r!=destRow; c+=hDir, r+=vDir){
                    if(isOccupied(r, c))
                        return false
                }
        }


        if (legal && !checkingCheck) {
            piece.detach().appendTo(destSquare).css({top:0, left:0})
                if(oppPiece.length>0)
                    oppPiece.detach().appendTo(".sidebar")
            let inCheck=(checkCheck(newKingpos.row, newKingpos.column, oppColor))
            if (inCheck || checkingCheckmate) {
                piece.detach().appendTo(sourceSquare)
                if(oppPiece.length>0)
                    oppPiece.detach().appendTo(destSquare)
            }
            if (inCheck) {
                 return false
            }
            if (checkingCheckmate) {
                return true
            }
            let oppKingpos=getPosition("king",oppColor, 1)
            let oppCheck=(checkCheck (oppKingpos.row, oppKingpos.column, pieceColor))
            let oppCheckmate=false
            if (oppCheck) {
                oppCheckmate=checkCheckmate (oppColor)
                console.log (oppCheckmate)
            }
            let item= {
              piece: piece,
              type: pieceType,
              color: pieceColor,
              number: pieceNumber,
              srcRow: srcRow,
              srcCol: srcCol,
              srcSquare: sourceSquare,
              destSquare: destSquare,
              row: destRow,
              column: destCol,
              capture: oppPiece.length>0?oppPiece:null,
              check: oppCheck,
              checkmate: oppCheckmate,
              castling: castling?(destCol==7?"0-0":"0-0-0"):false
            };
            history.push(item)
        }

        if (print){
            console.log (legal)
        }

        return legal;
    }

    function checkCheck (row, col, color) {
        let oppPiece= $('td.chess-square>img.chesspieces[color="'+color+'"]')
        let check= false
        oppPiece.each (function(i,p) {
            let piece=$(p);
            let type=piece.attr("type"), number=piece.attr("number"), srcRow=piece.parent().attr("row"), srcColumn=piece.parent().attr("column")
            if (checkLegal(type, color, number, srcRow, srcColumn, row, col, true)){
                check= true
            }
        })
        return check
    }

    function checkCheckmate (color) {
        console.log ("checkingCheckmate")
        let pieces= $('td.chess-square>img.chesspieces[color="'+color+'"]')
        let checkmate= true
        pieces.each (function(i,p) {
            let piece=$(p);
            let type=piece.attr("type"), number=piece.attr("number"), srcRow=piece.parent().attr("row"), srcColumn=piece.parent().attr("column")
            for (let r=1; r<=8; r++) {
                for (let c=1; c<=8; c++) {
                    if (checkLegal(type, color, number, srcRow, srcColumn, r, c, false, true)){
                     checkmate=false
                     console.log (color+" "+type+" can move to "+r+","+c)
                     break
                    }
                }
                if (!checkmate)
                    break
            }
        })
        return checkmate;
    }

    function numMoves (pieceType, pieceColor, pieceNumber) {
        let num=0;
        for (let item of history) {
            if (item.type==pieceType && item.color==pieceColor && item.number==pieceNumber)
                num++;
        }
        return num
    }

    function getPiece (pieceType, pieceColor, pieceNumber) {
        return $("img[color="+pieceColor+"][type="+pieceType+"][number="+pieceNumber+"]")
    }

    function getSpace (row, col) {
        return $(".chess-square[row="+row+"][column="+col+"]");
    }

    function getPosition (pieceType, pieceColor, pieceNumber) {
        let space=getPiece (pieceType, pieceColor, pieceNumber).parent()
        return  {
            row: space.attr("row"), column: space.attr("column")
        }
    }

    function isOccupied (row, col, color) {
        let square= $(".chess-square[row="+row+"][column="+col+"]");
        let selector= color? "[color="+color+"]" : "";
        let piece=square.find("img"+selector);
        return piece.length>0
    }

    $(document).ready(function() {
        $("#chessboard td").addClass("droppable chess-square");
        $("#chessboard img").addClass("chesspieces")

        for(let i=0; i<8; i++) {
            let row = $("#chessboard tr:nth-child("+(i+1)+")");
            row.attr("row",i+1);
            for(let c=0; c<8; c++) {
                let square = row.children("td:nth-child("+(c+1)+")");
                    square.attr("row",i+1);
                    square.attr("column",c+1);
            }

        }

        $(".draggable").draggable();
        $( ".droppable" ).droppable({
            drop: function(event, ui) {
            let src=ui.draggable.parent()
            let filename=ui.draggable.attr("src");

            let srcRow=parseInt(src.attr("row")), srcCol=parseInt(src.attr("column"));
            let dest=$(this)
            let type= ui.draggable.attr("type"), color= ui.draggable.attr("color"), number=ui.draggable.attr("number")
            let destRow=parseInt(dest.attr("row")), destCol=parseInt(dest.attr("column"));
            let legal=checkLegal(type, color, number, srcRow, srcCol, destRow, destCol)
                     if (legal) {
           //  ui.draggable.detach().appendTo(this).css({top:0, left:0});
                displayHistory()
                turn=turn=="white"?"black":"white"

            }
        else {
            ui.draggable.css({top:0, left:0});
            }
                $(".chess-square").removeClass("occupied")
                $( this )
                  .addClass( "occupied" )
          }
        });

        $(document).keypress(function(e) {
            console.log ("key pressed: "+e.which)
            switch(e.which) {
                case 114:
                    let lastMove= history[history.length-1]
                    lastMove.piece.detach().appendTo(lastMove.srcSquare)
                    turn= lastMove.color
                    let oppPiece= lastMove.capture
                    if(oppPiece) {
                        oppPiece.detach().appendTo(lastMove.destSquare)
                    }
                    if (lastMove.castling) {
                        if(lastMove.column==3) {
                            let rook=getPiece("rook",lastMove.color,1)
                            rook.detach().appendTo(getSpace(lastMove.row,1))
                        }   else if(lastMove.column==7){
                            let rook=getPiece("rook",lastMove.color,2)
                            rook.detach().appendTo(getSpace(lastMove.row,8))
                        }
                    }
                    history.pop()
                    displayHistory()
                    break;
            }
        })

    });



