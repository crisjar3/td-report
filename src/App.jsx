import './App.css'
import { fetchData, groupByProjectName } from './Logic/Data'
import { createExcelPages } from './Logic/Excel';

function App() {
  const GetData = async (from, to) => {
    const dateRange = getDividedDateRange(from, to, 10);

    let data = [];

    let lengthTotal = 0

    for (const segment of dateRange) {
      const segmentData = await fetchData(segment.from, segment.to);

      lengthTotal += segmentData.length
      data = data.concat(segmentData);
    }

    data = groupByProjectName(data);

    await createExcelPages(data);

  };

  const GetDefault = () => {
    // console.log('testing')
    GetData('2023-11-31T00:00:00.000Z', '2023-12-28T23:59:00.000Z')
  }



  return (
    <>
      <button className='button' onClick={GetDefault}>Descargar reporte</button>
    </>
  )
}

Date.prototype.addDays = function (days) {
  let date = new Date(this.valueOf());

  date.setDate(date.getDate() + days);

  return date;
}

const getDividedDateRange = (from, to, segmentSize) => {
  const dateRange = [];
  let startDate = new Date(from);
  const endDate = new Date(to);

  while (startDate.addDays(segmentSize - 1) < endDate) {

    let segmentTo = new Date(startDate);

    segmentTo = segmentTo.addDays(segmentSize - 1);

    const segment = {
      from: startDate.toISOString(),
      to: segmentTo.toISOString(),
    };

    dateRange.push(segment);

    startDate = startDate.addDays(segmentSize);
  }

  if (startDate <= endDate) {
    const segment = {
      from: startDate.toISOString(),
      to: endDate.toISOString(),
    };
    dateRange.push(segment);
  }

  return dateRange;
};


export default App
