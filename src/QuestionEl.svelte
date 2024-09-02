<script lang="ts">
    import type { Question } from "$lib/types";
    import { createEventDispatcher } from "svelte";

    export let question: Question;

	const dispatch = createEventDispatcher<{
		"vote": {
			vote: Vote
		}
	}>()

	type Vote = "yes" | "no" | "open" | "vague";

	function vote(vote: Vote) {
		return () => dispatch('vote', { vote })
	}
</script>

<div class="container">
    <h2>
        {question.question}
    </h2>
	<div class="vote row">
		{#each Object.entries(question.votes) as [vote, num]}
			<div class="bar {vote}" style="flex:{num}">{vote} ({num})</div>
		{/each}
	</div>
	<div class="row">
		<span>My vote:</span>
		<button class="circle" on:click={vote("yes")}>Yes</button>
		<button class="circle" on:click={vote("no")}>No</button>
		<button on:click={vote("open")}>Still open</button>
		<button on:click={vote("vague")}>Too vague</button>
	</div>
</div>

<style>
	.bar {
		display: flex;
		padding: 5px;
		margin: 2px;
		justify-content: center;
	}

	.row span {
		font-size: 1.25em;
		font-weight: bold;
	}

	.bar:first-child {
		border-top-left-radius: 20px;
		border-bottom-left-radius: 20px;
	}

	.bar:last-child {
		border-top-right-radius: 20px;
		border-bottom-right-radius: 20px;
	}

	.yes {
		background-color: darkgreen;
	}

	.no {
		background-color: darkred;
	}

	.vague {
		background-color: gray;
	}

	.open {
		background-color: darkcyan;
	}

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
		align-items: center;
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
		height: 50px;
	}

    button:hover {
        text-decoration: underline;
    }
</style>
