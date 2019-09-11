var ctx = document.getElementById('affiliateReportChart').getContext('2d');

var data = {
    labels: ["21.02.2019", "10.03.2019", "05.04.2019", "21.04.2019", "14.05.2019", "21.06.2019", "06.07.2019"],
    datasets: [
        {
          label: "Total turnover:",
          data: [0, 59, 75, 20, 20, 55, 40],
            lineTension: 0.5,
            borderColor: 'rgb(78, 185, 235)',
            backgroundColor: 'rgba(191, 237, 255, 0.2)',
            pointBorderColor: 'rgb(78, 185, 235)',
            pointRadius: 3,
            pointHoverRadius: 10,
            pointHitRadius: 30,
            pointBorderWidth: 2,
            pointStyle: 'rectRounded'
            }
           ]
  };
   
  var options = {
    legend: {
      display: true,
      position: 'top',
      labels: {
        boxWidth: 80,
        fontColor: 'black'
      }
    }
  };

var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
});
