<script>
    export let question;
</script>

<div class="container">
    <h2>
        {question.question}
    </h2>
    <div class="row">
        <button class="circle">Yes</button>
        <button class="circle">No</button>
        <button>Still open</button>
        <button>Too vague</button>
    </div>
</div>

<style>
    .container {
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        padding: 25px 0px;
    }

	h2 {
		font-size: 1.5em;
	}

	.row {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.circle {
		width: 50px;
		height: 50px;
		padding: 0px;
	}

	button {
		background-color: rgba(255, 255, 255, 0.1);
		border: none;
		color: white;
		margin: 10px;
		border-radius: 100px;
		padding: 0px 20px;
        cursor: pointer;
	}

    button:hover {
        text-decoration: underline;
    }
</style>
