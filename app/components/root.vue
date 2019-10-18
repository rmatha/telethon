<template>
	<Page class="page" actionBarHidden="true">
        <BottomNavigation>
      <TabStrip>
        <TabStripItem>
          <Label text="Equipe"></Label>
        </TabStripItem>
        <TabStripItem>
          <Label text="Défis"></Label>
        </TabStripItem>
        <TabStripItem>
          <Label text="Scores"></Label>
        </TabStripItem>
      </TabStrip>

      <TabContentItem>
        <Frame>
          <equipe />
        </Frame>
      </TabContentItem>

      <TabContentItem>
        <Frame>
          <mesDefis />
        </Frame>
      </TabContentItem>

      <TabContentItem>
        <Frame>
          <resultats />
        </Frame>
      </TabContentItem>
    </BottomNavigation>
    </Page>
</template>

<script>
	import changeEquipe from "./equipe/changeEquipe";
	import equipe from "./equipe/equipe";
	import mesDefis from "./defi/mesDefis";
	import resultats from "./score/resultats";
	
    export default {
		components: {
			equipe,
			mesDefis,
			resultats
		},
		computed: {
        },
        mounted() {
			
		},
        
		methods: {
		}
    };
</script>
<style>
</style>
