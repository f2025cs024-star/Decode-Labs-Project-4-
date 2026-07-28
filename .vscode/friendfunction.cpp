#include<iostream>
#include<cmath>
using namespace std;

class Point {          // renamed from distance to Point
    int x, y;
public:
    void getdata() {
        cout << "Enter x coordinate: ";
        cin >> x;
        cout << "Enter y coordinate: ";
        cin >> y;
    }

    friend double dis(Point d1, Point d2);
};

double dis(Point d1, Point d2) {
    int dx = d2.x - d1.x;
    int dy = d2.y - d1.y;
    return sqrt(dx*dx + dy*dy);
}

int main() {
    Point p1, p2;

    cout << "Point 1:" << endl;
    p1.getdata();

    cout << "Point 2:" << endl;
    p2.getdata();

    cout << "Distance: " << dis(p1, p2) << endl;

    return 0;
}