#include <iostream>
using namespace std;

class Distance {
public:
    float kmToMiles(float km) {
        return km * 0.621371;
    }

    float milesToKm(float miles) {
        return miles * 1.60934;
    }
};

int main() {
    Distance d;

    cout << "10 km = " << d.kmToMiles(10) << " miles" << endl;
    cout << "6.2 miles = " << d.milesToKm(6.2) << " km" << endl;

    return 0;
}