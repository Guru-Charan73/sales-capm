sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'predictionnamespace/predictionappmodule/test/integration/FirstJourney',
		'predictionnamespace/predictionappmodule/test/integration/pages/SalesDataList',
		'predictionnamespace/predictionappmodule/test/integration/pages/SalesDataObjectPage'
    ],
    function(JourneyRunner, opaJourney, SalesDataList, SalesDataObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('predictionnamespace/predictionappmodule') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheSalesDataList: SalesDataList,
					onTheSalesDataObjectPage: SalesDataObjectPage
                }
            },
            opaJourney.run
        );
    }
);