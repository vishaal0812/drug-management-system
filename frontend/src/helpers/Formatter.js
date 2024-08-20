export function dateFormatter(date) {
    let split = date.split('-');
    return split[2] + '-' + split[1] + '-' + split[0];
}