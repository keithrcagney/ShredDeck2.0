import * as moment from 'moment';

const dateParser = (SQLdateObj) => {
  const parsed = moment(SQLdateObj, "YYY-MM-DDTHH:mm:ssZ").toDate().toString();
  const text = parsed.slice(4,10) + ', ' + '\'' + parsed.slice(13, 15);
  return text;
};

export default dateParser;