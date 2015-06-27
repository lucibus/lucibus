package output

// IntRange takes a slice of ints and returns the min and max values
func IntRange(s []int) (min, max int) {
	if len(s) == 0 {
		return 0, 0
	}
	min = s[0]
	max = s[0]
	for i := range s {
		if i < min {
			min = i
		}
		if i > max {
			max = i
		}
	}
	return
}

// MaxInt returns the larger of the two ints
func MaxInt(x, y int) (r int) {
	if x > y {
		return x
	}
	return y
}
