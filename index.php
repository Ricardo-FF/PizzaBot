<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pizzaria Bons do Pedaço</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
</head>

<body>
    <div class="container">
        <div class="chatbox">
            <div class="header">
            <div class="avatar"></div>
            <div class=nickname>
                <h4>Pizzaria Bons do Pedaço</h4>
                <br>
                <p class="headerstatus">Online</p></div>
            </div>

            <div class="body" id="chatbody">
                <div class="scroller"></div>
            </div>

            <form class="chat" method="post" autocomplete="off">
                <div style="width:100%;display:inline-block;background:rgb(44, 32, 32);">
                <div>
                    <input type="text" name="chat" id="chat" placeholder="Mensagem...">
                </div>
                <div>
                    <input type="submit" value="" id="btn">
                </div></div>
            </form>

        </div>
    </div>
    <script type="text/javascript" src="Pizzas.js"></script>
    <script src="app.js"></script>
    
</body>

</html>